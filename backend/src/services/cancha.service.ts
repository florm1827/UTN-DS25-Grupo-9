import { CanchaModel } from "../models/cancha.model";
import { ActualizarEstadoCanchaDTO, Cancha } from "../types/cancha.types";

export const CanchaService = {
  listar(): Cancha[] {
    return CanchaModel.listar().sort((a,b)=>a.nombre.localeCompare(b.nombre));
  },

  actualizarEstado(id: string, dto: ActualizarEstadoCanchaDTO): Cancha {
    const idx = CanchaModel.indicePorId(id);
    if (idx < 0) { const e:any=new Error("Cancha no encontrada"); e.statusCode=404; throw e; }

    const actual = CanchaModel.listar()[idx];
    const actualizado: Cancha = {
      ...actual,
      estado: dto.estado,
      actualizadaEn: new Date().toISOString()
    };

    return CanchaModel.actualizar(idx, actualizado);
  }
};