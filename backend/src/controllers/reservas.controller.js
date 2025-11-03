// src/controllers/reservas.controller.js
import prisma from '../lib/prisma.js'

// helpers
function getDayRange(fechaStr) {
  const start = new Date(fechaStr)
  start.setHours(0, 0, 0, 0)
  const end = new Date(fechaStr)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

// chequea si hay solapamiento con ACEPTADAS para ese día/cancha
async function haySolapamientoAceptadas({ cancha, fecha, horaInicio, horaFin, excluirId = null }) {
  const { start, end } = getDayRange(fecha)

  const aceptadas = await prisma.reserva.findMany({
    where: {
      cancha,
      estado: 'ACEPTADA',
      fecha: {
        gte: start,
        lte: end,
      },
      ...(excluirId ? { NOT: { id: excluirId } } : {}),
    },
  })

  return aceptadas.some((r) => horaInicio < r.horaFin && horaFin > r.horaInicio)
}

// USER: crea solicitud de reserva (queda PENDIENTE) pero valida contra ACEPTADAS
export const crearReserva = async (req, res) => {
  try {
    const { cancha, horaInicio, horaFin, nombre, fecha } = req.body

    if (!fecha) {
      return res.status(400).json({ ok: false, msg: 'La fecha es obligatoria' })
    }

    const existeSolape = await haySolapamientoAceptadas({
      cancha,
      fecha,
      horaInicio,
      horaFin,
    })

    if (existeSolape) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe una reserva aceptada para esa cancha y horario.',
      })
    }

    const reserva = await prisma.reserva.create({
      data: {
        cancha,
        horaInicio,
        horaFin,
        nombre,
        fecha: new Date(fecha),
        usuarioId: req.user.id,
      },
    })

    return res.status(201).json({
      ok: true,
      msg: 'Solicitud enviada. Esperando aprobación del administrador.',
      reserva,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al crear la reserva' })
  }
}

// USER: ver solo ACEPTADAS (para la grilla) — con ?fecha=
export const listarReservasAceptadas = async (req, res) => {
  try {
    const { fecha } = req.query
    const where = {
      estado: 'ACEPTADA',
    }

    if (fecha) {
      const { start, end } = getDayRange(fecha)
      where.fecha = {
        gte: start,
        lte: end,
      }
    }

    const reservas = await prisma.reserva.findMany({
      where,
      orderBy: [
        { fecha: 'asc' },
        { horaInicio: 'asc' },
      ],
    })

    return res.json({ ok: true, reservas })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al obtener reservas' })
  }
}

// USER: ver MIS reservas (todas)
export const listarMisReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: req.user.id },
      orderBy: [
        { fecha: 'desc' },
        { createdAt: 'desc' },
      ],
    })
    return res.json({ ok: true, reservas })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al obtener tus reservas' })
  }
}

// USER: cancelar su propia solicitud (solo si está PENDIENTE)
export const cancelarMiReserva = async (req, res) => {
  const { id } = req.params
  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: Number(id) },
    })

    if (!reserva || reserva.usuarioId !== req.user.id) {
      return res.status(404).json({ ok: false, msg: 'Reserva no encontrada' })
    }

    if (reserva.estado !== 'PENDIENTE') {
      return res
        .status(400)
        .json({ ok: false, msg: 'Solo se pueden cancelar reservas pendientes' })
    }

    const actualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado: 'CANCELADA' },
    })

    return res.json({ ok: true, msg: 'Solicitud cancelada', reserva: actualizada })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al cancelar la reserva' })
  }
}

// ADMIN: ver solicitudes pendientes (con filtros)
export const listarPendientes = async (req, res) => {
  try {
    const { fecha, cancha } = req.query
    const where = { estado: 'PENDIENTE' }

    if (fecha) {
      const { start, end } = getDayRange(fecha)
      where.fecha = { gte: start, lte: end }
    }
    if (cancha) {
      where.cancha = cancha
    }

    const reservas = await prisma.reserva.findMany({
      where,
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return res.json({ ok: true, reservas })
  } catch (err) {
    return res.status(500).json({ ok: false, msg: 'Error al obtener pendientes' })
  }
}

// ADMIN: ver TODOS los turnos aceptados (con filtros)
export const listarAceptadasAdmin = async (req, res) => {
  try {
    const { fecha, cancha, nombre } = req.query
    const where = {
      estado: 'ACEPTADA',
    }

    if (fecha) {
      const { start, end } = getDayRange(fecha)
      where.fecha = { gte: start, lte: end }
    }

    if (cancha) {
      where.cancha = cancha
    }

    // nombre puede ser el nombre de la reserva o el nombre del usuario
    let reservas = await prisma.reserva.findMany({
      where,
      include: {
        usuario: { select: { id: true, nombre: true, email: true } },
      },
      orderBy: [
        { fecha: 'desc' },
        { horaInicio: 'asc' },
      ],
    })

    if (nombre) {
      const n = nombre.toLowerCase()
      reservas = reservas.filter(
        (r) =>
          r.nombre.toLowerCase().includes(n) ||
          r.usuario?.nombre?.toLowerCase().includes(n) ||
          r.usuario?.email?.toLowerCase().includes(n)
      )
    }

    return res.json({ ok: true, reservas })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al obtener aceptadas' })
  }
}

// ADMIN: aceptar (revalida solapamiento)
export const aceptarReserva = async (req, res) => {
  const { id } = req.params
  const { comentario } = req.body || {}

  try {
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(id) } })
    if (!reserva) {
      return res.status(404).json({ ok: false, msg: 'Reserva no encontrada' })
    }

    const existeSolape = await haySolapamientoAceptadas({
      cancha: reserva.cancha,
      fecha: reserva.fecha.toISOString().slice(0, 10),
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      excluirId: reserva.id,
    })

    if (existeSolape) {
      return res.status(400).json({
        ok: false,
        msg: 'No se puede aceptar: ya hay una reserva aceptada en ese horario.',
      })
    }

    const actualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado: 'ACEPTADA', comentario },
    })

    return res.json({ ok: true, msg: 'Reserva aceptada', reserva: actualizada })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al aceptar la reserva' })
  }
}

// ADMIN: rechazar con comentario
export const rechazarReserva = async (req, res) => {
  const { id } = req.params
  const { comentario } = req.body || {}

  try {
    const reserva = await prisma.reserva.update({
      where: { id: Number(id) },
      data: { estado: 'RECHAZADA', comentario },
    })
    return res.json({ ok: true, msg: 'Reserva rechazada', reserva })
  } catch (err) {
    return res.status(500).json({ ok: false, msg: 'Error al rechazar la reserva' })
  }
}

// ADMIN: modificar una aceptada (cambiar cancha/hora/fecha/nombre) con validación de solape
export const actualizarReservaAdmin = async (req, res) => {
  const { id } = req.params
  const { cancha, fecha, horaInicio, horaFin, nombre, comentario } = req.body

  try {
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(id) } })
    if (!reserva) {
      return res.status(404).json({ ok: false, msg: 'Reserva no encontrada' })
    }

    const nuevaCancha = cancha || reserva.cancha
    const nuevaFecha = fecha || reserva.fecha.toISOString().slice(0, 10)
    const nuevaHoraInicio = horaInicio || reserva.horaInicio
    const nuevaHoraFin = horaFin || reserva.horaFin

    const existeSolape = await haySolapamientoAceptadas({
      cancha: nuevaCancha,
      fecha: nuevaFecha,
      horaInicio: nuevaHoraInicio,
      horaFin: nuevaHoraFin,
      excluirId: reserva.id,
    })

    if (existeSolape) {
      return res.status(400).json({
        ok: false,
        msg: 'No se puede modificar: ya hay una reserva aceptada en ese horario.',
      })
    }

    const actualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: {
        cancha: nuevaCancha,
        fecha: new Date(nuevaFecha),
        horaInicio: nuevaHoraInicio,
        horaFin: nuevaHoraFin,
        nombre: nombre ?? reserva.nombre,
        comentario: comentario ?? reserva.comentario,
      },
    })

    return res.json({ ok: true, msg: 'Reserva actualizada', reserva: actualizada })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al actualizar la reserva' })
  }
}

// ADMIN: dar de baja (poner CANCELADA)
export const bajaReservaAdmin = async (req, res) => {
  const { id } = req.params
  const { comentario } = req.body || {}

  try {
    const actualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: {
        estado: 'CANCELADA',
        comentario,
      },
    })
    return res.json({ ok: true, msg: 'Reserva dada de baja', reserva: actualizada })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, msg: 'Error al dar de baja la reserva' })
  }
}
