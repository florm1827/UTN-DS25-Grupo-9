import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { UsuarioModel } from "../models/usuario.model";
import {
  InicioSesionDTO,
  RegistroDTO,
  RespuestaAuth,
  Rol,
  Usuario,
  UsuarioAutenticado
} from "../types/usuario.types";

// tuve que tipar de forma expliciata porque no lo tomaba bien ts
const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "dev_secret";
const JWT_EXPIRES: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES ?? "2h") as SignOptions["expiresIn"];

function aPublico(u: Usuario): UsuarioAutenticado {
  return { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol };
}

export const AuthService = {
  async registrar(dto: RegistroDTO): Promise<RespuestaAuth> {
    const existente = UsuarioModel.obtenerPorEmail(dto.email);
    if (existente) { const e: any = new Error("El email ya está registrado"); e.statusCode = 409; throw e; }

    const hash = await bcrypt.hash(dto.contrasenia, 10);
    const ahora = new Date().toISOString();

    const usuario: Usuario = {
      id: crypto.randomUUID(),
      nombre: dto.nombre,
      email: dto.email,
      rol: "USUARIO",
      contraseniaHash: hash,
      creadoEn: ahora,
      actualizadoEn: ahora
    };

    UsuarioModel.crear(usuario);

    const token = jwt.sign(aPublico(usuario), JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return { token, usuario: aPublico(usuario) };
  },

  async iniciarSesion(dto: InicioSesionDTO): Promise<RespuestaAuth> {
    const u = UsuarioModel.obtenerPorEmail(dto.email);
    if (!u) { const e: any = new Error("Credenciales inválidas"); e.statusCode = 401; throw e; }

    const ok = await bcrypt.compare(dto.contrasenia, u.contraseniaHash);
    if (!ok) { const e: any = new Error("Credenciales inválidas"); e.statusCode = 401; throw e; }

    const token = jwt.sign(aPublico(u), JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return { token, usuario: aPublico(u) };
  },

  perfil(desdeToken: UsuarioAutenticado): UsuarioAutenticado {
    return desdeToken;
  }
};
