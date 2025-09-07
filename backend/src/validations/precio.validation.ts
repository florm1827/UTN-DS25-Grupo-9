import { z } from "zod";

export const actualizarPrecioSchema = z.object({
  // z.literal no acepta errorMap → validamos con refine:
  minutosPorBloque: z.number().refine((val) => val === 30, {
    message: "Sólo se admite 30 minutos",
  }),
  precioPorBloque: z.number().positive("Debe ser > 0"),
  moneda: z.enum(["ARS","USD"]).optional(),
  vigenteDesde: z.string().datetime().optional()
});

export const cotizacionSchema = z.object({
  canchaId: z.string().min(1),
  inicio: z.string().datetime({ offset: true }),
  fin: z.string().datetime({ offset: true })
})
.refine(d => new Date(d.inicio) < new Date(d.fin), {
  message: "inicio debe ser menor que fin",
  path: ["inicio"]
})
.refine(d => {
  const m1 = new Date(d.inicio).getMinutes(); const s1 = new Date(d.inicio).getSeconds();
  const m2 = new Date(d.fin).getMinutes();    const s2 = new Date(d.fin).getSeconds();
  return (m1 === 0 || m1 === 30) && s1 === 0 && (m2 === 0 || m2 === 30) && s2 === 0;
}, { message: "Los horarios deben caer en min:00 o min:30" });
