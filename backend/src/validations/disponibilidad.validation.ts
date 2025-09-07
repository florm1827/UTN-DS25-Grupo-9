import { z } from "zod";

export const disponibilidadQuerySchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "fecha YYYY-MM-DD"),
  canchaId: z.string().optional()
});
