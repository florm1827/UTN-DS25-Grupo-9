import { prisma } from "../config/prisma";
import { ReservaModel } from "../models/reserva.model";
import { CanchaModel } from "../models/cancha.model";

export type EstadoReserva = "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "CANCELADA";

export interface FiltroReservas {
  fecha?: string;     
  estado?: EstadoReserva;
  canchaId?: string;
  mias?: boolean;
  usuarioId?: string; 
}


const MINUTOS_BLOQUE = 30;

function esMultiploDe30(iso: string): boolean {
  const d = new Date(iso);
  return d.getSeconds() === 0 && (d.getMinutes() === 0 || d.getMinutes() === 30);
}

function rangoValido(inicioISO: string, finISO: string): boolean {
  return new Date(inicioISO).getTime() < new Date(finISO).getTime();
}

function rangoDelDia(yyyyMMdd: string) {
  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  const desde = new Date(y, m - 1, d, 0, 0, 0, 0);
  const hasta = new Date(y, m - 1, d, 23, 59, 59, 999);
  return { desde, hasta };
}

/* ================ Servicio ================= */

export const ReservaService = {
  /**
   * Lista reservas con filtros opcionales.
   * - Si viene `fecha`, filtra por reservas cuyo `inicio` cae ese día.
   * - Si `mias=true`, además requiere `usuarioId`.
   */
  async listar(filtro: FiltroReservas) {
    const where: any = {};

    if (filtro.estado)   where.estado   = filtro.estado;
    if (filtro.canchaId) where.canchaId = filtro.canchaId;
    if (filtro.mias && filtro.usuarioId) where.usuarioId = filtro.usuarioId;

    if (filtro.fecha) {
      const { desde, hasta } = rangoDelDia(filtro.fecha);
      // Buscar por inicio dentro del día
      where.inicio = { gte: desde, lte: hasta };
    }

    return prisma.reserva.findMany({
      where,
      orderBy: { inicio: "asc" }
    });
  },

  /**
   * Crea una nueva solicitud de reserva en estado PENDIENTE.
   * Valida: múltiplos de 30', rango válido, cancha HABILITADA y
   * no superposición con reservas ACEPTADAS.
   */
  async crear(
    dto: { canchaId: string; inicio: string; fin: string; nombreMostrar: string; },
    usuarioId?: string
  ) {
    // Validaciones básicas de horario
    if (!esMultiploDe30(dto.inicio) || !esMultiploDe30(dto.fin)) {
      const e: any = new Error("Los horarios deben caer en min:00 o min:30.");
      e.statusCode = 400; throw e;
    }
    if (!rangoValido(dto.inicio, dto.fin)) {
      const e: any = new Error("El rango horario es inválido (inicio < fin).");
      e.statusCode = 400; throw e;
    }

    // Cancha habilitada
    const cancha = await CanchaModel.obtenerPorId(dto.canchaId);
    if (!cancha || cancha.estado !== "HABILITADA") {
      const e: any = new Error("La cancha no está habilitada.");
      e.statusCode = 400; throw e;
    }

    // No solapar con ACEPTADAS existentes
    const solape = await prisma.reserva.findFirst({
      where: {
        canchaId: dto.canchaId,
        estado: "ACEPTADA",
        inicio: { lt: new Date(dto.fin) },    // inicio aceptada < fin nuevo
        fin:    { gt: new Date(dto.inicio) }  // fin aceptada    > inicio nuevo
      }
    });
    if (solape) {
      const e: any = new Error("Se superpone con una reserva aceptada.");
      e.statusCode = 409; throw e;
    }

    // Crear en estado PENDIENTE (lo maneja el model)
    return ReservaModel.crear({
      ...dto,
      usuarioId
    });
  },

  /**
   * Actualiza el estado de una reserva.
   * - CANCELADA: sólo ADMIN o el dueño (actorId === usuarioId de la reserva).
   * - ACEPTADA: vuelve a chequear que no se superponga con otra ACEPTADA.
   */
  async actualizarEstado(
    id: string,
    nuevoEstado: EstadoReserva,
    actorId?: string,
    esAdmin = false
  ) {
    const actual = await ReservaModel.obtenerPorId(id);
    if (!actual) {
      const e: any = new Error("Reserva no encontrada.");
      e.statusCode = 404; throw e;
    }

    // Política básica para cancelar
    if (nuevoEstado === "CANCELADA" && !esAdmin) {
      if (!actorId || actual.usuarioId !== actorId) {
        const e: any = new Error("No puede cancelar esta reserva.");
        e.statusCode = 403; throw e;
      }
    }

    // Al aceptar, asegurar que no haya solape con otras ACEPTADAS
    if (nuevoEstado === "ACEPTADA") {
      const solape = await prisma.reserva.findFirst({
        where: {
          id: { not: id },
          canchaId: actual.canchaId,
          estado: "ACEPTADA",
          inicio: { lt: actual.fin },
          fin:    { gt: actual.inicio }
        }
      });
      if (solape) {
        const e: any = new Error("No se puede aceptar: solapa con otra reserva aceptada.");
        e.statusCode = 409; throw e;
      }
    }

    return ReservaModel.actualizarEstado(id, nuevoEstado);
  }
};



// // src/services/reserva.service.ts
// import crypto from "node:crypto";
// import {
//   ActualizarEstadoReservaDTO,
//   CrearReservaDTO,
//   FiltroReservas,
//   Reserva
// } from "../types/reserva.types";
// import { ReservaModel } from "../models/reserva.model";

// const MINUTOS_BLOQUE = 30;

// // Helpers internos
// function esMultiploDe30(iso: string): boolean {
//   const d = new Date(iso);
//   return d.getMinutes() % MINUTOS_BLOQUE === 0 && d.getSeconds() === 0;
// }
// function rangoValido(inicioISO: string, finISO: string): boolean {
//   const i = new Date(inicioISO).getTime();
//   const f = new Date(finISO).getTime();
//   return i < f;
// }
// function mismoDia(iso: string, yyyyMMdd: string): boolean {
//   const d = new Date(iso);
//   const [y, m, day] = yyyyMMdd.split("-").map(Number);
//   return (
//     d.getFullYear() === y &&
//     d.getMonth() + 1 === m &&
//     d.getDate() === day
//   );
// }
// function seSolapan(aInicio: Date, aFin: Date, bInicio: Date, bFin: Date): boolean {
//   return aInicio < bFin && bInicio < aFin;
// }

// export const ReservaService = {
//   listar(filtro: FiltroReservas): Reserva[] {
//     let data = ReservaModel.listar();

//     if (filtro.estado) data = data.filter(r => r.estado === filtro.estado);
//     if (filtro.canchaId) data = data.filter(r => r.canchaId === filtro.canchaId);
//     // if (filtro.fecha) data = data.filter(r => mismoDia(r.inicio, filtro.fecha));
//     if (filtro.fecha !== undefined) data = data.filter(r => mismoDia(r.inicio, filtro.fecha as string));
//     if (filtro.mias && filtro.usuarioId) {
//       data = data.filter(r => r.usuarioId === filtro.usuarioId);
//     }

//     // orden por inicio asc
//     return data.sort((a, b) => a.inicio.localeCompare(b.inicio));
//   },

//   crear(dto: CrearReservaDTO, usuarioId?: string): Reserva {
//     // Validaciones
//     if (!esMultiploDe30(dto.inicio) || !esMultiploDe30(dto.fin)) {
//       const err: any = new Error("Los horarios deben caer en intervalos de 30 minutos (min:00 o min:30).");
//       err.statusCode = 400; throw err;
//     }
//     if (!rangoValido(dto.inicio, dto.fin)) {
//       const err: any = new Error("El rango horario es inválido (inicio < fin).");
//       err.statusCode = 400; throw err;
//     }

//     // (Aquí podrías validar: cancha habilitada)
//     // Validar solape con ACEPTADAS
//     const iN = new Date(dto.inicio);
//     const fN = new Date(dto.fin);

//     const haySolapeAceptadas = ReservaModel
//       .listar()
//       .filter(r => r.canchaId === dto.canchaId && r.estado === "ACEPTADA")
//       .some(r => seSolapan(iN, fN, new Date(r.inicio), new Date(r.fin)));

//     if (haySolapeAceptadas) {
//       const err: any = new Error("El rango solicitado se superpone con una reserva aceptada.");
//       err.statusCode = 409; throw err;
//     }

//     const ahora = new Date().toISOString();
//     const nueva: Reserva = {
//       id: crypto.randomUUID(),
//       usuarioId,
//       canchaId: dto.canchaId,
//       inicio: dto.inicio,
//       fin: dto.fin,
//       estado: "PENDIENTE",
//       nombreMostrar: dto.nombreMostrar,
//       creadoEn: ahora,
//       actualizadoEn: ahora
//     };

//     return ReservaModel.crear(nueva);
//   },

//   actualizarEstado(id: string, dto: ActualizarEstadoReservaDTO, actorId?: string, esAdmin = false): Reserva {
//     const idx = ReservaModel.indicePorId(id);
//     if (idx < 0) { const e:any = new Error("Reserva no encontrada"); e.statusCode=404; throw e; }

//     const actual = ReservaModel.listar()[idx];

//     // Política de cancelación por usuario
//     if (dto.estado === "CANCELADA" && !esAdmin && actorId && actual.usuarioId !== actorId) {
//       const e:any = new Error("No tiene permisos para cancelar esta reserva");
//       e.statusCode = 403; throw e;
//     }

//     // ACEPTAR: verificar que siga sin solape respecto a ACEPTADAS
//     if (dto.estado === "ACEPTADA") {
//       const iN = new Date(actual.inicio);
//       const fN = new Date(actual.fin);
//       const haySolapeAceptadas = ReservaModel
//         .listar()
//         .filter(r => r.canchaId === actual.canchaId && r.estado === "ACEPTADA" && r.id !== actual.id)
//         .some(r => seSolapan(iN, fN, new Date(r.inicio), new Date(r.fin)));

//       if (haySolapeAceptadas) {
//         const e:any = new Error("No se puede aceptar: solapada con otra reserva aceptada");
//         e.statusCode = 409; throw e;
//       }
//     }

//     const actualizado: Reserva = {
//       ...actual,
//       estado: dto.estado,
//       motivoRechazo: dto.estado === "RECHAZADA" ? (dto.motivoRechazo || "Sin motivo especificado") : actual.motivoRechazo,
//       actualizadoEn: new Date().toISOString()
//     };

//     return ReservaModel.actualizar(idx, actualizado);
//   }
// };
