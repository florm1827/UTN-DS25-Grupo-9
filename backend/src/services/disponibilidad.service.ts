import { ReservaModel } from "../models/reserva.model";
import { CanchaModel } from "../models/cancha.model";
import { ConsultaDisponibilidad, IntervaloDisponibilidad } from "../types/disponibilidad.types";

const MINUTOS_BLOQUE = 30;
// horario por defecto
const HORA_INICIO = 8;  // 08:00
const HORA_FIN = 23;    // 23:00 (último slot termina a las 23:00)

function aISO(date: Date): string {
  // genera ISO con la zona local del servidor; si querés forzar -03:00, ajustá con Intl/temporal
  return date.toISOString();
}

function construirFecha(fecha: string, hh: number, mm: number): Date {
  // fecha: "YYYY-MM-DD" (interpreta como local)
  const [y, m, d] = fecha.split("-").map(Number);
  const dt = new Date(y, (m - 1), d, hh, mm, 0, 0);
  return dt;
}

function seSolapan(aIni: Date, aFin: Date, bIni: Date, bFin: Date): boolean {
  return aIni < bFin && bIni < aFin;
}

export const DisponibilidadService = {
  obtenerSlots(query: ConsultaDisponibilidad): IntervaloDisponibilidad[] {
    const { fecha, canchaId } = query;

    // 1) canchas habilitadas (filtrar si viene canchaId)
    const canchas = CanchaModel
      .listar()
      .filter(c => c.estado === "HABILITADA" && (!canchaId || c.id === canchaId));

    // 2) reservas aceptadas del día por cancha
    const aceptadas = ReservaModel
      .listar()
      .filter(r => r.estado === "ACEPTADA")
      .filter(r => {
        const d = new Date(r.inicio);
        const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
        const fechaR = `${y.toString().padStart(4, "0")}-${m.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
        return fechaR === fecha;
      });

    const out: IntervaloDisponibilidad[] = [];

    for (const c of canchas) {
      // 3) generar slots de 30’ entre 08:00 y 23:00
      let cursor = construirFecha(fecha, HORA_INICIO, 0);
      const finDia = construirFecha(fecha, HORA_FIN, 0);

      while (cursor < finDia) {
        const inicio = new Date(cursor);
        const fin = new Date(cursor.getTime() + MINUTOS_BLOQUE * 60000);

        // ¿se solapa con alguna aceptada de esta cancha?
        const ocupado = aceptadas
          .filter(r => r.canchaId === c.id)
          .some(r => seSolapan(inicio, fin, new Date(r.inicio), new Date(r.fin)));

        out.push({
          canchaId: c.id,
          inicio: aISO(inicio),
          fin: aISO(fin),
          estado: ocupado ? "OCUPADO" : "LIBRE"
        });

        cursor = fin;
      }
    }

    return out;
  }
};
