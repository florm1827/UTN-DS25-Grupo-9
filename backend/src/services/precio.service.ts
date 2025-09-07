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


function asMoneda(x: unknown): "ARS" | "USD" {
  return x === "USD" ? "USD" : "ARS";
}


function toPrecio(p: {
  minutosPorBloque: number;
  precioPorBloque: number;
  moneda: string; 
  vigenteDesde: Date | string;
  actualizadoEn: Date | string;
}): Precio {
  return {
    minutosPorBloque: 30,
    precioPorBloque: p.precioPorBloque,
    moneda: asMoneda(p.moneda), 
    vigenteDesde:
      typeof p.vigenteDesde === "string"
        ? p.vigenteDesde
        : p.vigenteDesde.toISOString(),
    actualizadoEn:
      typeof p.actualizadoEn === "string"
        ? p.actualizadoEn
        : p.actualizadoEn.toISOString()
  };
}

export const PrecioService = {
  async obtenerVigente(): Promise<Precio> {
    const db = await PrecioModel.obtener();
    return toPrecio(db as any);
  },

  async actualizar(dto: ActualizarPrecioDTO): Promise<Precio> {
    if (dto.minutosPorBloque !== 30) {
      const e: any = new Error("Sólo se admite un bloque de 30 minutos.");
      e.statusCode = 400; throw e;
    }
    if (dto.precioPorBloque <= 0) {
      const e: any = new Error("El precio por bloque debe ser mayor que cero.");
      e.statusCode = 400; throw e;
    }

    const actual = await PrecioModel.obtener();

    const vigenteDesdeDate = dto.vigenteDesde
      ? new Date(dto.vigenteDesde)
      : new Date();

    const actualizadoDb = await PrecioModel.actualizar({
      precioPorBloque: dto.precioPorBloque,
      // no mandan moneda
      moneda: dto.moneda ?? asMoneda(actual.moneda),
      vigenteDesde: vigenteDesdeDate
    });

    return toPrecio(actualizadoDb as any);
  },

  cotizar(dto: SolicitudCotizacionDTO): RespuestaCotizacionDTO {
    if (!esMultiploDe30(dto.inicio) || !esMultiploDe30(dto.fin)) {
      const e:any = new Error("Los horarios deben caer en min:00 o min:30."); e.statusCode = 400; throw e;
    }
    if (!rangoValido(dto.inicio, dto.fin)) {
      const e:any = new Error("El rango horario es inválido (inicio < fin)."); e.statusCode = 400; throw e;
    }

    const mins = diferenciaMinutos(dto.inicio, dto.fin);
    if (mins % MINUTOS_BLOQUE !== 0) {
      const e:any = new Error("El rango debe ser múltiplo de 30 minutos."); e.statusCode = 400; throw e;
    }

    const bloques = mins / MINUTOS_BLOQUE;


    const vigente = (PrecioModel as any).obtenerSync
      ? (PrecioModel as any).obtenerSync()
      : undefined;

    const precioPorBloque = vigente?.precioPorBloque ?? 0;
    const total = bloques * precioPorBloque;

    return {
      bloques,
      minutosPorBloque: 30,
      precioPorBloque,
      total,
      moneda: asMoneda(vigente?.moneda ?? "ARS"),
      notas: "La cotización no garantiza disponibilidad; se valida al crear la reserva."
    };
  }
};
