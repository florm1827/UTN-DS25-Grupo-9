import { Precio } from "../types/precio.types";

let precioVigente: Precio = {
  minutosPorBloque: 30,
  precioPorBloque: 2500,
  moneda: "ARS",
  vigenteDesde: new Date().toISOString(),
  actualizadoEn: new Date().toISOString()
};

export const PrecioModel = {
  obtener(): Precio {
    return precioVigente;
  },
  actualizar(nuevo: Precio): Precio {
    precioVigente = nuevo;
    return precioVigente;
  }
};