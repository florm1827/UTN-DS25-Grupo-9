import { CanchaModel } from "../models/cancha.model";
import { ActualizarEstadoCanchaDTO, Cancha } from "../types/cancha.types";

function toCancha(c: {
  id: string;
  nombre: string;
  estado: string;
  creadoEn: Date | string;
  actualizadoEn: Date | string;
}): Cancha {
  return {
    id: c.id,
    nombre: c.nombre,
    estado: (c.estado === "DESHABILITADA" ? "DESHABILITADA" : "HABILITADA"),
    creadaEn: c.creadoEn instanceof Date ? c.creadoEn.toISOString() : (c.creadoEn as string),
    actualizadaEn: c.actualizadoEn instanceof Date ? c.actualizadoEn.toISOString() : (c.actualizadoEn as string),
  };
}

export const CanchaService = {
  /** Devuelve todas las canchas (ordenadas por nombre). */
  async listar(): Promise<Cancha[]> {
    const rows = await CanchaModel.listar();
    return rows.map(toCancha);
  },

  /** Cambia el estado de una cancha (habilitar / deshabilitar). */
  async actualizarEstado(id: string, dto: ActualizarEstadoCanchaDTO): Promise<Cancha> {
    const actual = await CanchaModel.obtenerPorId(id);
    if (!actual) {
      const e: any = new Error("Cancha no encontrada");
      e.statusCode = 404;
      throw e;
    }

    const updated = await CanchaModel.actualizarEstado(id, dto.estado);
    return toCancha(updated);
  },
};
