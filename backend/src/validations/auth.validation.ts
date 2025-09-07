import { z } from "zod";

export const registroSchema = z.object({
  nombre: z.string().trim().min(2).max(60),
  email: z.string().email(),
  contrasenia: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
});

export const inicioSesionSchema = z.object({
  email: z.string().email(),
  contrasenia: z.string().min(8)
});
