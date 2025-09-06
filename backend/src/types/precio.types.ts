export interface Precio {
  minutosPorBloque: 30;      // fijo a 30' según tu negocio
  precioPorBloque: number;   // p. ej. 2500
  moneda: "ARS" | "USD";
  vigenteDesde: string;      // ISO: cuándo empezó a regir
  actualizadoEn: string;     // ISO: última modificación
}

export interface ActualizarPrecioDTO {
  minutosPorBloque: 30;      // por ahora fijo a 30
  precioPorBloque: number;
  moneda?: "ARS" | "USD";
  vigenteDesde?: string;     // si no se envía, se toma ahora
}

export interface SolicitudCotizacionDTO {
  canchaId: string;          // se incluye por trazabilidad / futuras reglas
  inicio: string;            // ISODateTime
  fin: string;               // ISODateTime
}

export interface RespuestaCotizacionDTO {
  bloques: number;
  minutosPorBloque: 30;
  precioPorBloque: number;
  total: number;
  moneda: "ARS" | "USD";
  notas?: string;
}