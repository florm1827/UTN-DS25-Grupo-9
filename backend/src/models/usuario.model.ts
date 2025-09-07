import { prisma } from "../config/prisma";

export const UsuarioModel = {
  listar() { return prisma.usuario.findMany(); },
  obtenerPorEmail(email: string) { return prisma.usuario.findUnique({ where: { email } }); },
  obtenerPorId(id: string) { return prisma.usuario.findUnique({ where: { id } }); },
  crear(data: { nombre: string; email: string; rol: "USUARIO"|"ADMIN"; contraseniaHash: string; }) {
    return prisma.usuario.create({ data });
  }
};

// import { Usuario } from "../types/usuario.types";

// const usuarios: Usuario[] = []; // almacenamiento en memoria

// export const UsuarioModel = {
//   listar(): Usuario[] { return usuarios; },
//   obtenerPorEmail(email: string): Usuario | undefined {
//     return usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
//   },
//   obtenerPorId(id: string): Usuario | undefined {
//     return usuarios.find(u => u.id === id);
//   },
//   crear(nuevo: Usuario): Usuario {
//     usuarios.push(nuevo);
//     return nuevo;
//   },
//   actualizar(indice: number, actualizado: Usuario): Usuario {
//     usuarios[indice] = actualizado;
//     return actualizado;
//   },
//   indicePorId(id: string): number {
//     return usuarios.findIndex(u => u.id === id);
//   }
// };
