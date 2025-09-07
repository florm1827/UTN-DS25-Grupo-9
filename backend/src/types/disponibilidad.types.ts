export type EstadoIntervalo = "LIBRE" | "OCUPADO";

export interface ConsultaDisponibilidad {
  fecha: string;     
  canchaId?: string; 
}

export interface IntervaloDisponibilidad { 
  canchaId: string;
  inicio: string; 
  fin: string;    
  estado: EstadoIntervalo;
}
