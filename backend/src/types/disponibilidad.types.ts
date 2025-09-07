export type EstadoIntervalo = "LIBRE" | "OCUPADO";

export interface ConsultaDisponibilidad {
  fecha: string;     // YYYY-MM-DD
  canchaId?: string; // opcional
}

export interface IntervaloDisponibilidad { 
  canchaId: string;
  inicio: string; 
  fin: string;    
  estado: EstadoIntervalo;
}
