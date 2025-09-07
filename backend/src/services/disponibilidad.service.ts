// src/services/disponibilidad.service.ts
import { ReservaModel } from "../models/reserva.model";
import { CanchaModel } from "../models/cancha.model";
import { ConsultaDisponibilidad, IntervaloDisponibilidad } from "../types/disponibilidad.types";

const MINUTOS_BLOQUE = 30;
// horario por defecto
const HORA_INICIO = 8;  // 08:00
const HORA_FIN = 23;    // 23:00 (último slot termina a las 23:00)

function aISO(date: Date): string {
  // Genera ISO en UTC (ej: 2025-06-01T11:00:00.000Z)
  return date.toISOString();
}

function construirFecha(fecha: string, hh: number, mm: number): Date {
  // fecha: "YYYY-MM-DD" 
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function seSolapan(aIni: Date, aFin: Date, bIni: Date, bFin: Date): boolean {
  return aIni < bFin && bIni < aFin;
}

function mismoDia(d: Date, fechaYYYYMMDD: string): boolean {
  const [y, m, day] = fechaYYYYMMDD.split("-").map(Number);
  return (
    d.getFullYear() === y &&
    d.getMonth() + 1 === m &&
    d.getDate() === day
  );
}

export const DisponibilidadService = {
  /**
   * Devuelve todos los intervalos de 30' (08:00 → 23:00) por cancha,
   * marcando si están LIBRE u OCUPADO según reservas ACEPTADAS del día.
   */
  async obtenerSlots(query: ConsultaDisponibilidad): Promise<IntervaloDisponibilidad[]> {
    const { fecha, canchaId } = query;

    // 1) canchas habilitadas
    const canchasDB = await CanchaModel.listar();
    const canchas = canchasDB.filter(
      (c) => c.estado === "HABILITADA" && (!canchaId || c.id === canchaId)
    );

    // 2) reservas aceptadas del día
    const reservasDB = await ReservaModel.listar();
    const aceptadas = reservasDB
      .filter((r) => r.estado === "ACEPTADA")
      .filter((r) => {
        const inicio = r.inicio instanceof Date ? r.inicio : new Date(r.inicio as any);
        return mismoDia(inicio, fecha);
      });

    const out: IntervaloDisponibilidad[] = [];

    for (const c of canchas) {
      // 3) generar slots de 30’ entre 08:00 y 23:00
      let cursor = construirFecha(fecha, HORA_INICIO, 0);
      const finDia = construirFecha(fecha, HORA_FIN, 0);

      while (cursor < finDia) {
        const inicio = new Date(cursor);
        const fin = new Date(cursor.getTime() + MINUTOS_BLOQUE * 60000);

        // ¿se solapa con alguna ACEPTADA de esta cancha?
        const ocupado = aceptadas
          .filter((r) => r.canchaId === c.id)
          .some((r) => {
            const ri = r.inicio instanceof Date ? r.inicio : new Date(r.inicio as any);
            const rf = r.fin    instanceof Date ? r.fin    : new Date(r.fin as any);
            return seSolapan(inicio, fin, ri, rf);
          });

        out.push({
          canchaId: c.id,
          inicio: aISO(inicio),
          fin: aISO(fin),
          estado: ocupado ? "OCUPADO" : "LIBRE",
        });

        cursor = fin;
      }
    }

    return out;
  },
};
