import { PrecioModel } from "../models/precio.model";
import {
  ActualizarPrecioDTO,
  Precio,
  RespuestaCotizacionDTO,
  SolicitudCotizacionDTO
} from "../types/precio.types";

const MINUTOS_BLOQUE = 30;

function esMultiploDe30(iso: string): boolean {
  const d = new Date(iso);
  return d.getMinutes() % MINUTOS_BLOQUE === 0 && d.getSeconds() === 0;
}
function rangoValido(inicioISO: string, finISO: string): boolean {
  const i = new Date(inicioISO).getTime();
  const f = new Date(finISO).getTime();
  return i < f;
}
function diferenciaMinutos(inicioISO: string, finISO: string): number {
  const i = new Date(inicioISO).getTime();
  const f = new Date(finISO).getTime();
  return Math.round((f - i) / 60000);
}

export const PrecioService = {
  obtenerVigente(): Precio {
    return PrecioModel.obtener();
  },

  actualizar(dto: ActualizarPrecioDTO): Precio {
    if (dto.minutosPorBloque !== 30) {
      const e: any = new Error("Sólo se admite un bloque de 30 minutos.");
      e.statusCode = 400; throw e;
    }
    if (dto.precioPorBloque <= 0) {
      const e: any = new Error("El precio por bloque debe ser mayor que cero.");
      e.statusCode = 400; throw e;
    }

    const actual = PrecioModel.obtener();
    const actualizado: Precio = {
      minutosPorBloque: 30,
      precioPorBloque: dto.precioPorBloque,
      moneda: dto.moneda ?? actual.moneda,
      vigenteDesde: dto.vigenteDesde ?? new Date().toISOString(),
      actualizadoEn: new Date().toISOString()
    };
    return PrecioModel.actualizar(actualizado);
  },

  cotizar(dto: SolicitudCotizacionDTO): RespuestaCotizacionDTO {
    // Esta cotización SOLO calcula precio; la validación de solapes/estado de cancha
    // se hace en el módulo de Reservas al crear/aceptar.
    if (!esMultiploDe30(dto.inicio) || !esMultiploDe30(dto.fin)) {
      const e:any = new Error("Los horarios deben caer en min:00 o min:30.");
      e.statusCode = 400; throw e;
    }
    if (!rangoValido(dto.inicio, dto.fin)) {
      const e:any = new Error("El rango horario es inválido (inicio < fin).");
      e.statusCode = 400; throw e;
    }

    const mins = diferenciaMinutos(dto.inicio, dto.fin);
    if (mins % MINUTOS_BLOQUE !== 0) {
      const e:any = new Error("El rango debe ser múltiplo de 30 minutos.");
      e.statusCode = 400; throw e;
    }

    const bloques = mins / MINUTOS_BLOQUE;
    const vigente = PrecioModel.obtener();
    const total = bloques * vigente.precioPorBloque;

    return {
      bloques,
      minutosPorBloque: 30,
      precioPorBloque: vigente.precioPorBloque,
      total,
      moneda: vigente.moneda,
      notas: "La cotización no garantiza disponibilidad; se valida al crear la reserva."
    };
  }
};
