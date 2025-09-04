export type ISODateTime = string;

export type EstadoReserva = "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "CANCELADA";

export interface Reserva {
  id: string;
  usuarioId?: string;       
  canchaId: string;
  inicio: ISODateTime;
  fin: ISODateTime;
  estado: EstadoReserva;
  nombreMostrar: string;     
  creadoEn: ISODateTime;
  actualizadoEn: ISODateTime;
  motivoRechazo?: string;
}

export interface CrearReservaDTO {
  canchaId: string;
  inicio: ISODateTime;
  fin: ISODateTime;
  nombreMostrar: string;
}

export interface ActualizarEstadoReservaDTO {
  estado: "ACEPTADA" | "RECHAZADA" | "CANCELADA";
  motivoRechazo?: string;
}

export interface FiltroReservas {
  fecha?: string;      
  estado?: EstadoReserva;
  canchaId?: string;
  mias?: boolean;
  usuarioId?: string;  
}
