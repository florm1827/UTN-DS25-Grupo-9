// src/schemas/auth.schema.js
import { z } from 'zod'

export const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  // 👇 aunque venga rol del frontend, NO lo vamos a respetar si no es admin
  rol: z.enum(['USER', 'ADMIN']).optional()
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
