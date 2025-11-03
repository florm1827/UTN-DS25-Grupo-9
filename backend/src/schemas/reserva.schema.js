// src/schemas/reserva.schema.js
import { z } from 'zod'

export const createReservaSchema = z.object({
  cancha: z.string().min(1, 'La cancha es obligatoria'),
  horaInicio: z.string().min(1, 'La hora de inicio es obligatoria'),
  horaFin: z.string().min(1, 'La hora de fin es obligatoria'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  fecha: z.string().min(1, 'La fecha es obligatoria'),
})
