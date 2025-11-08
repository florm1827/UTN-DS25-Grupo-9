import { z } from 'zod'

export const createReservaSchema = z.object({
  cancha: z.string().min(1),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/),
  nombre: z.string().min(1),           // si es USER, el backend lo sobreescribe por su nombre
  fecha: z.string().min(1),            // YYYY-MM-DD
  tipo: z.enum(['RESERVA','TURNO_FIJO','CLASE','ESCUELA','TORNEO','MANTENIMIENTO'])
        .optional()
        .default('RESERVA'),
})

export const updateReservaAdminSchema = z.object({
  cancha: z.string().optional(),
  fecha: z.string().optional(),        // YYYY-MM-DD
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  nombre: z.string().optional(),
  comentario: z.string().optional(),
  tipo: z.enum(['RESERVA','TURNO_FIJO','CLASE','ESCUELA','TORNEO','MANTENIMIENTO']).optional(),
})
