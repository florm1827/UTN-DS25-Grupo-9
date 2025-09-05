export type EstadoCancha = "HABILITADA" | "DESHABILITADA";

export interface Cancha {
  id: string;
  nombre: string;
  estado: EstadoCancha;
  creadaEn: string;
  actualizadaEn: string;
}

export interface ActualizarEstadoCanchaDTO {
  estado: EstadoCancha;
  nota?: string;
}