import { prisma } from "../config/prisma";


function asMoneda(x: unknown): "ARS" | "USD" {
  return x === "USD" ? "USD" : "ARS";
}

export const PrecioModel = {
  async obtener() {
    const existente = await prisma.precio.findUnique({ where: { id: 1 } });
    if (existente) return existente;

    return prisma.precio.create({
      data: {
        id: 1,
        minutosPorBloque: 30,
        precioPorBloque: 3000,
        moneda: "ARS"
      }
    });
  },

  async actualizar(data: {
    precioPorBloque: number;
    moneda?: "ARS" | "USD";
    vigenteDesde?: Date;
  }) {
    await this.obtener();

  
    const payload: any = {
      precioPorBloque: data.precioPorBloque,
    };
    if (data.moneda) payload.moneda = asMoneda(data.moneda);
    if (data.vigenteDesde) payload.vigenteDesde = data.vigenteDesde;

    return prisma.precio.update({
      where: { id: 1 },
      data: payload
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