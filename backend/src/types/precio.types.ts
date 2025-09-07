export interface Precio {
  minutosPorBloque: 30;      // fijo a 30' según tu negocio
  precioPorBloque: number;   
  moneda: "ARS" | "USD";
  vigenteDesde: string;     
  actualizadoEn: string;    
}

export interface ActualizarPrecioDTO {
  minutosPorBloque: 30;      // por ahora fijo a 30
  precioPorBloque: number;
  moneda?: "ARS" | "USD";
  vigenteDesde?: string;     // si no se envía, se toma ahora
}

export interface SolicitudCotizacionDTO {
  canchaId: string;          
  inicio: string;            
  fin: string;               
}

export interface RespuestaCotizacionDTO {
  bloques: number;
  minutosPorBloque: 30;
  precioPorBloque: number;
  total: number;
  moneda: "ARS" | "USD";
  notas?: string;
}