// src/services/reserva.service.ts
import crypto from "node:crypto";
import {
  ActualizarEstadoReservaDTO,
  CrearReservaDTO,
  FiltroReservas,
  Reserva
} from "../types/reserva.types";
import { ReservaModel } from "../models/reserva.model";

const MINUTOS_BLOQUE = 30;

// Helpers internos
function esMultiploDe30(iso: string): boolean {
  const d = new Date(iso);
  return d.getMinutes() % MINUTOS_BLOQUE === 0 && d.getSeconds() === 0;
}
function rangoValido(inicioISO: string, finISO: string): boolean {
  const i = new Date(inicioISO).getTime();
  const f = new Date(finISO).getTime();
  return i < f;
}
function mismoDia(iso: string, yyyyMMdd: string): boolean {
  const d = new Date(iso);
  const [y, m, day] = yyyyMMdd.split("-").map(Number);
  return (
    d.getFullYear() === y &&
    d.getMonth() + 1 === m &&
    d.getDate() === day
  );
}
function seSolapan(aInicio: Date, aFin: Date, bInicio: Date, bFin: Date): boolean {
  return aInicio < bFin && bInicio < aFin;
}

export const ReservaService = {
  listar(filtro: FiltroReservas): Reserva[] {
    let data = ReservaModel.listar();

    if (filtro.estado) data = data.filter(r => r.estado === filtro.estado);
    if (filtro.canchaId) data = data.filter(r => r.canchaId === filtro.canchaId);
    // if (filtro.fecha) data = data.filter(r => mismoDia(r.inicio, filtro.fecha));
    if (filtro.fecha !== undefined) data = data.filter(r => mismoDia(r.inicio, filtro.fecha as string));
    if (filtro.mias && filtro.usuarioId) {
      data = data.filter(r => r.usuarioId === filtro.usuarioId);
    }

    // orden por inicio asc
    return data.sort((a, b) => a.inicio.localeCompare(b.inicio));
  },

  crear(dto: CrearReservaDTO, usuarioId?: string): Reserva {
    // Validaciones
    if (!esMultiploDe30(dto.inicio) || !esMultiploDe30(dto.fin)) {
      const err: any = new Error("Los horarios deben caer en intervalos de 30 minutos (min:00 o min:30).");
      err.statusCode = 400; throw err;
    }
    if (!rangoValido(dto.inicio, dto.fin)) {
      const err: any = new Error("El rango horario es inválido (inicio < fin).");
      err.statusCode = 400; throw err;
    }

    // (Aquí podrías validar: cancha habilitada)
    // Validar solape con ACEPTADAS
    const iN = new Date(dto.inicio);
    const fN = new Date(dto.fin);

    const haySolapeAceptadas = ReservaModel
      .listar()
      .filter(r => r.canchaId === dto.canchaId && r.estado === "ACEPTADA")
      .some(r => seSolapan(iN, fN, new Date(r.inicio), new Date(r.fin)));

    if (haySolapeAceptadas) {
      const err: any = new Error("El rango solicitado se superpone con una reserva aceptada.");
      err.statusCode = 409; throw err;
    }

    const ahora = new Date().toISOString();
    const nueva: Reserva = {
      id: crypto.randomUUID(),
      usuarioId,
      canchaId: dto.canchaId,
      inicio: dto.inicio,
      fin: dto.fin,
      estado: "PENDIENTE",
      nombreMostrar: dto.nombreMostrar,
      creadoEn: ahora,
      actualizadoEn: ahora
    };

    return ReservaModel.crear(nueva);
  },

  actualizarEstado(id: string, dto: ActualizarEstadoReservaDTO, actorId?: string, esAdmin = false): Reserva {
    const idx = ReservaModel.indicePorId(id);
    if (idx < 0) { const e:any = new Error("Reserva no encontrada"); e.statusCode=404; throw e; }

    const actual = ReservaModel.listar()[idx];

    // Política de cancelación por usuario
    if (dto.estado === "CANCELADA" && !esAdmin && actorId && actual.usuarioId !== actorId) {
      const e:any = new Error("No tiene permisos para cancelar esta reserva");
      e.statusCode = 403; throw e;
    }

    // ACEPTAR: verificar que siga sin solape respecto a ACEPTADAS
    if (dto.estado === "ACEPTADA") {
      const iN = new Date(actual.inicio);
      const fN = new Date(actual.fin);
      const haySolapeAceptadas = ReservaModel
        .listar()
        .filter(r => r.canchaId === actual.canchaId && r.estado === "ACEPTADA" && r.id !== actual.id)
        .some(r => seSolapan(iN, fN, new Date(r.inicio), new Date(r.fin)));

      if (haySolapeAceptadas) {
        const e:any = new Error("No se puede aceptar: solapada con otra reserva aceptada");
        e.statusCode = 409; throw e;
      }
    }

    const actualizado: Reserva = {
      ...actual,
      estado: dto.estado,
      motivoRechazo: dto.estado === "RECHAZADA" ? (dto.motivoRechazo || "Sin motivo especificado") : actual.motivoRechazo,
      actualizadoEn: new Date().toISOString()
    };

    return ReservaModel.actualizar(idx, actualizado);
  }
};
