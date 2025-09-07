import { z } from "zod";

export const cambiarEstadoParamsSchema = z.object({
  id: z.string().uuid("id debe ser UUID")
});

export const cambiarEstadoBodySchema = z.object({
  estado: z.enum(["HABILITADA","DESHABILITADA"]),
  nota: z.string().trim().min(1).optional()
});
