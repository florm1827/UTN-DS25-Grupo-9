// src/routes/reservas.routes.js
import { Router } from 'express'
import { authRequired } from '../middlewares/auth.js'
import { validate } from '../middlewares/validate.js'
import { createReservaSchema } from '../schemas/reserva.schema.js'
import {
  crearReserva,
  listarReservasAceptadas,
  listarPendientes,
  aceptarReserva,
  rechazarReserva,
  listarMisReservas,
  cancelarMiReservaPendiente,
  listarAceptadasAdmin,
  actualizarReservaAdmin,
  bajaReservaAdmin,
} from '../controllers/reservas.controller.js'

const router = Router()

// USER: crear solicitud
router.post('/', authRequired(), validate(createReservaSchema), crearReserva)

// USER: grilla (aceptadas) con ?fecha=
router.get('/', authRequired(), listarReservasAceptadas)

// USER: ver MIS reservas
router.get('/mias', authRequired(), listarMisReservas)

// USER: cancelar su PENDIENTE
router.patch('/mias/:id/cancelar', authRequired(), cancelarMiReservaPendiente)

// ADMIN: ver PENDIENTES
router.get('/pendientes', authRequired(['ADMIN']), listarPendientes)

// ADMIN: ver ACEPTADAS (turnos)
router.get('/admin/aceptadas', authRequired(['ADMIN']), listarAceptadasAdmin)

// ADMIN: aceptar / rechazar
router.patch('/:id/aceptar', authRequired(['ADMIN']), aceptarReserva)
router.patch('/:id/rechazar', authRequired(['ADMIN']), rechazarReserva)

// ADMIN: modificar una aceptada
router.patch('/:id/admin', authRequired(['ADMIN']), actualizarReservaAdmin)

// ADMIN: dar de baja
router.patch('/:id/baja', authRequired(['ADMIN']), bajaReservaAdmin)

export default router
