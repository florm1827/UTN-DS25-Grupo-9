import { Cancha } from "../types/cancha.types";

const canchas: Cancha[] = [
  { id: "1", nombre: "Cancha 1", estado: "HABILITADA", creadaEn: new Date().toISOString(), actualizadaEn: new Date().toISOString() },
  { id: "2", nombre: "Cancha 2", estado: "HABILITADA", creadaEn: new Date().toISOString(), actualizadaEn: new Date().toISOString() },
];

export const CanchaModel = {
  listar(): Cancha[] { return canchas; },
  obtenerPorId(id: string): Cancha | undefined { return canchas.find(c => c.id === id); },
  actualizar(indice: number, cancha: Cancha): Cancha { canchas[indice] = cancha; return cancha; },
  indicePorId(id: string): number { return canchas.findIndex(c => c.id === id); }
};