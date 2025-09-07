// src/models/reserva.model.ts
import { prisma } from "../config/prisma";
import type { EstadoReserva } from "../types/enums-locales";

export const ReservaModel = {
  listar() {
    return prisma.reserva.findMany();
  },
  obtenerPorId(id: string) {
    return prisma.reserva.findUnique({ where: { id } });
  },
  crear(data: { usuarioId?: string | null; canchaId: string; inicio: string; fin: string; nombreMostrar: string; }) {
    return prisma.reserva.create({
      data: {
        usuarioId: data.usuarioId ?? null,
        canchaId: data.canchaId,
        inicio: new Date(data.inicio),
        fin: new Date(data.fin),
        nombreMostrar: data.nombreMostrar,
        estado: "PENDIENTE" // ← string literal
      }
    });
  },
  actualizarEstado(id: string, estado: EstadoReserva, motivoRechazo?: string) {
    return prisma.reserva.update({ where: { id }, data: { estado, motivoRechazo } });
  }
};


// import { Reserva } from "../types/reserva.types";

// const reservas: Reserva[] = []; 

// export const ReservaModel = {
//   listar(): Reserva[] {
//     return reservas;
//   },
//   obtenerPorId(id: string): Reserva | undefined {
//     return reservas.find(r => r.id === id);
//   },
//   crear(nueva: Reserva): Reserva {
//     reservas.push(nueva);
//     return nueva;
//   },
//   actualizar(indice: number, actualizada: Reserva): Reserva {
//     reservas[indice] = actualizada;
//     return actualizada;
//   },
//   indicePorId(id: string): number {
//     return reservas.findIndex(r => r.id === id);
//   }
// };
