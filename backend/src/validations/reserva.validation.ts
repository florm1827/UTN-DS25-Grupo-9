import { z } from "zod";

const isoDateTime = z.string().datetime({ offset: true });

const minutos00o30 = (iso: string) => {
  const d = new Date(iso);
  return d.getSeconds() === 0 && (d.getMinutes() === 0 || d.getMinutes() === 30);
};

export const crearReservaSchema = z.object({
  canchaId: z.string().min(1, "canchaId es requerido"),
  inicio: isoDateTime.refine(minutos00o30, "inicio debe caer en min:00 o min:30"),
  fin:    isoDateTime.refine(minutos00o30, "fin debe caer en min:00 o min:30"),
  nombreMostrar: z.string().trim().min(1).max(60)
}).refine(d => new Date(d.inicio).getTime() < new Date(d.fin).getTime(), {
  message: "inicio debe ser menor que fin",
  path: ["inicio"]
});

export const listarReservasQuerySchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "fecha YYYY-MM-DD").optional(),
  estado: z.enum(["PENDIENTE","ACEPTADA","RECHAZADA","CANCELADA"]).optional(),
  canchaId: z.string().optional(),
  mias: z.coerce.boolean().optional()
});

export const actualizarEstadoParamsSchema = z.object({
  id: z.string().uuid("id debe ser UUID")
});

export const actualizarEstadoBodySchema = z.object({
  estado: z.enum(["ACEPTADA","RECHAZADA","CANCELADA"]),
  motivoRechazo: z.string().trim().min(1, "motivoRechazo requerido al RECHAZAR").optional()
}).refine(d => d.estado !== "RECHAZADA" || !!d.motivoRechazo, {
  message: "motivoRechazo es requerido al RECHAZAR",
  path: ["motivoRechazo"]
});
