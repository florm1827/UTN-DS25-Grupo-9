import { prisma } from "../config/prisma";

export const PrecioModel = {
  async obtener() {
    const p = await prisma.precio.findUnique({ where: { id: 1 } });
    return p ?? prisma.precio.create({ data: { id: 1, minutosPorBloque: 30, precioPorBloque: 2500, moneda: "ARS" } });
  },
  actualizar(nuevo: { precioPorBloque: number; moneda?: "ARS" | "USD"; vigenteDesde?: Date; }) {
    return prisma.precio.update({
      where: { id: 1 },
      data: { precioPorBloque: nuevo.precioPorBloque, moneda: nuevo.moneda, vigenteDesde: nuevo.vigenteDesde }
    });
  }
};


// import { Precio } from "../types/precio.types";

// let precioVigente: Precio = {
//   minutosPorBloque: 30,
//   precioPorBloque: 2500,
//   moneda: "ARS",
//   vigenteDesde: new Date().toISOString(),
//   actualizadoEn: new Date().toISOString()
// };

// export const PrecioModel = {
//   obtener(): Precio {
//     return precioVigente;
//   },
//   actualizar(nuevo: Precio): Precio {
//     precioVigente = nuevo;
//     return precioVigente;
//   }
// };