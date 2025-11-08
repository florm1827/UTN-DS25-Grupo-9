import prisma from '../lib/prisma.js'

// -------- Helpers
const getDayRange = (fechaStr) => {
  // fechaStr: "YYYY-MM-DD"
  const start = new Date(`${fechaStr}T00:00:00.000Z`)
  const end = new Date(`${fechaStr}T23:59:59.999Z`)
  return { start, end }
}

const overlaps = (aStart, aEnd, bStart, bEnd) => (aStart < bEnd && aEnd > bStart)

const haySolapamientoAceptadas = async ({ cancha, fecha, horaInicio, horaFin, excluirId }) => {
  const { start, end } = getDayRange(fecha)
  const list = await prisma.reserva.findMany({
    where: {
      cancha,
      estado: 'ACEPTADA',
      fecha: { gte: start, lte: end },
      ...(excluirId ? { NOT: { id: Number(excluirId) } } : {}),
    }
  })
  return list.some(r => overlaps(horaInicio, horaFin, r.horaInicio, r.horaFin))
}

// -------- Permisos de tipo
const TIPOS_USER = ['RESERVA', 'TURNO_FIJO']
const TIPOS_ADMIN = ['RESERVA', 'TURNO_FIJO', 'CLASE', 'ESCUELA', 'TORNEO', 'MANTENIMIENTO']

// -------- Controllers

// Crear solicitud (USER/ADMIN)
export const crearReserva = async (req, res) => {
  try {
    const { cancha, horaInicio, horaFin, nombre, fecha, tipo: tipoIn } = req.body
    if (!fecha) return res.status(400).json({ ok:false, msg:'La fecha es obligatoria' })

    const isAdmin = req.user?.rol === 'ADMIN'
    const allowed = isAdmin ? TIPOS_ADMIN : TIPOS_USER
    const tipo = allowed.includes(tipoIn) ? tipoIn : 'RESERVA'
    const nombreFinal = isAdmin ? (nombre || 'Reserva') : (req.user?.nombre || 'Reserva')

    // Validación de solapamiento contra ACEPTADAS
    const existeSolape = await haySolapamientoAceptadas({ cancha, fecha, horaInicio, horaFin })
    if (existeSolape) return res.status(400).json({ ok:false, msg:'Ya existe una reserva aceptada para esa cancha y horario.' })

    const reserva = await prisma.reserva.create({
      data: {
        cancha, horaInicio, horaFin,
        nombre: nombreFinal,
        fecha: new Date(fecha),
        tipo,
        usuarioId: req.user.id,
      },
    })
    return res.status(201).json({ ok:true, msg:'Solicitud enviada. Esperando aprobación del administrador.', reserva })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al crear la reserva' })
  }
}

// Listar ACEPTADAS (público autenticado, filtra por fecha; usado por grilla)
export const listarReservasAceptadas = async (req, res) => {
  try {
    const { fecha, cancha } = req.query
    if (!fecha) return res.json({ ok:true, reservas: [] })
    const { start, end } = getDayRange(fecha)
    const reservas = await prisma.reserva.findMany({
      where: {
        estado: 'ACEPTADA',
        fecha: { gte: start, lte: end },
        ...(cancha ? { cancha } : {}),
      },
      include: { usuario: { select: { id:true, nombre:true, email:true } } },
      orderBy: [{ cancha: 'asc' }, { horaInicio: 'asc' }]
    })
    return res.json({ ok:true, reservas })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al listar reservas aceptadas' })
  }
}

// Mis reservas / notificaciones
export const listarMisReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: req.user.id },
      orderBy: [{ fecha: 'desc' }, { horaInicio: 'asc' }]
    })
    return res.json({ ok:true, reservas })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al listar mis reservas' })
  }
}

export const cancelarMiReservaPendiente = async (req, res) => {
  try {
    const { id } = req.params
    const r = await prisma.reserva.findUnique({ where: { id: Number(id) } })
    if (!r || r.usuarioId !== req.user.id) return res.status(404).json({ ok:false, msg:'Reserva no encontrada' })
    if (r.estado !== 'PENDIENTE') return res.status(400).json({ ok:false, msg:'Solo podés cancelar solicitudes pendientes' })
    await prisma.reserva.update({ where: { id: r.id }, data: { estado: 'CANCELADA' } })
    return res.json({ ok:true, msg:'Solicitud cancelada' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al cancelar solicitud' })
  }
}

// Admin: pendientes con filtros
export const listarPendientes = async (req, res) => {
  try {
    const { fecha, cancha, nombre } = req.query
    const where = { estado: 'PENDIENTE' }
    if (fecha) {
      const { start, end } = getDayRange(fecha)
      where.fecha = { gte: start, lte: end }
    }
    if (cancha) where.cancha = cancha
    if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' }

    const reservas = await prisma.reserva.findMany({
      where,
      include: { usuario: { select: { id:true, nombre:true, email:true } } },
      orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }]
    })
    return res.json({ ok:true, reservas })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al listar pendientes' })
  }
}

// Admin: aceptar (con revalidación de solape)
export const aceptarReserva = async (req, res) => {
  try {
    const { id } = req.params
    const { comentario } = req.body
    const r = await prisma.reserva.findUnique({ where: { id: Number(id) } })
    if (!r) return res.status(404).json({ ok:false, msg:'Reserva no encontrada' })
    if (r.estado !== 'PENDIENTE') return res.status(400).json({ ok:false, msg:'La reserva no está pendiente' })

    const fechaStr = r.fecha.toISOString().slice(0,10)
    const existeSolape = await haySolapamientoAceptadas({
      cancha: r.cancha, fecha: fechaStr, horaInicio: r.horaInicio, horaFin: r.horaFin, excluirId: r.id
    })
    if (existeSolape) return res.status(400).json({ ok:false, msg:'Solapamiento: ya hay una reserva aceptada en ese horario.' })

    const upd = await prisma.reserva.update({
      where: { id: r.id },
      data: { estado: 'ACEPTADA', comentario: comentario ?? r.comentario }
    })
    return res.json({ ok:true, msg:'Reserva aceptada', reserva: upd })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al aceptar' })
  }
}

// Admin: rechazar
export const rechazarReserva = async (req, res) => {
  try {
    const { id } = req.params
    const { comentario } = req.body
    const r = await prisma.reserva.findUnique({ where: { id: Number(id) } })
    if (!r) return res.status(404).json({ ok:false, msg:'Reserva no encontrada' })
    if (r.estado !== 'PENDIENTE') return res.status(400).json({ ok:false, msg:'La reserva no está pendiente' })
    const upd = await prisma.reserva.update({
      where: { id: r.id },
      data: { estado: 'RECHAZADA', comentario: comentario ?? r.comentario }
    })
    return res.json({ ok:true, msg:'Reserva rechazada', reserva: upd })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al rechazar' })
  }
}

// Admin: lista de aceptadas con filtros + edición y baja
export const listarAceptadasAdmin = async (req, res) => {
  try {
    const { fecha, cancha, nombre } = req.query
    const where = { estado: 'ACEPTADA' }
    if (fecha) {
      const { start, end } = getDayRange(fecha)
      where.fecha = { gte: start, lte: end }
    }
    if (cancha) where.cancha = cancha
    if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' }

    const reservas = await prisma.reserva.findMany({
      where,
      include: { usuario: { select: { id:true, nombre:true, email:true } } },
      orderBy: [{ fecha: 'asc' }, { horaInicio: 'asc' }]
    })
    return res.json({ ok:true, reservas })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al listar aceptadas' })
  }
}

export const actualizarReservaAdmin = async (req, res) => {
  const { id } = req.params
  const { cancha, fecha, horaInicio, horaFin, nombre, comentario, tipo } = req.body
  try {
    const reserva = await prisma.reserva.findUnique({ where: { id: Number(id) } })
    if (!reserva) return res.status(404).json({ ok:false, msg:'Reserva no encontrada' })

    // validar tipo (admin)
    let tipoFinal = reserva.tipo
    if (tipo) {
      if (!TIPOS_ADMIN.includes(tipo)) return res.status(400).json({ ok:false, msg:'Tipo de reserva no permitido' })
      tipoFinal = tipo
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
    if (existeSolape) return res.status(400).json({ ok:false, msg:'No se puede modificar: ya hay una reserva aceptada en ese horario.' })

    const actualizada = await prisma.reserva.update({
      where: { id: Number(id) },
      data: {
        cancha: nuevaCancha,
        fecha: new Date(nuevaFecha),
        horaInicio: nuevaHoraInicio,
        horaFin: nuevaHoraFin,
        nombre: nombre ?? reserva.nombre,
        comentario: comentario ?? reserva.comentario,
        tipo: tipoFinal,
      },
    })
    return res.json({ ok:true, msg:'Reserva actualizada', reserva: actualizada })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al actualizar la reserva' })
  }
}

export const bajaReservaAdmin = async (req, res) => {
  try {
    const { id } = req.params
    const { comentario } = req.body
    const r = await prisma.reserva.findUnique({ where: { id: Number(id) } })
    if (!r) return res.status(404).json({ ok:false, msg:'Reserva no encontrada' })
    if (r.estado !== 'ACEPTADA') return res.status(400).json({ ok:false, msg:'Solo se pueden dar de baja turnos aceptados' })
    const upd = await prisma.reserva.update({
      where: { id: r.id },
      data: { estado: 'CANCELADA', comentario: comentario ?? r.comentario }
    })
    return res.json({ ok:true, msg:'Turno dado de baja', reserva: upd })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok:false, msg:'Error al dar de baja' })
  }
}
