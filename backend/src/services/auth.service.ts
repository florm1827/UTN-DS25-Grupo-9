import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { UsuarioModel } from "../models/usuario.model";
import {
  InicioSesionDTO,
  RegistroDTO,
  RespuestaAuth,
  UsuarioAutenticado,
} from "../types/usuario.types";

// Config JWT
const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "dev_secret";
const JWT_EXPIRES: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES ?? "2h") as SignOptions["expiresIn"];

function aPublico(u: { id: string; nombre: string; email: string; rol: "USUARIO" | "ADMIN" }): UsuarioAutenticado {
  return { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol };
}

export const AuthService = {
  /** Registro de usuario (rol por defecto: USUARIO) */
  async registrar(dto: RegistroDTO): Promise<RespuestaAuth> {
    // 1) ¿ya existe?
    const existente = await UsuarioModel.obtenerPorEmail(dto.email);
    if (existente) {
      const e: any = new Error("El email ya está registrado");
      e.statusCode = 409;
      throw e;
    }

    // 2) hash
    const hash = await bcrypt.hash(dto.contrasenia, 10);

    // 3) crear en DB
    const creado = await UsuarioModel.crear({
      nombre: dto.nombre,
      email: dto.email,
      rol: "USUARIO",
      contraseniaHash: hash,
    });

    // 4) token
    const token = jwt.sign(aPublico(creado), JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return { token, usuario: aPublico(creado) };
  },

  /** Inicio de sesión: compara hash y devuelve JWT */
  async iniciarSesion(dto: InicioSesionDTO): Promise<RespuestaAuth> {
    const u = await UsuarioModel.obtenerPorEmail(dto.email);
    if (!u) {
      const e: any = new Error("Credenciales inválidas");
      e.statusCode = 401;
      throw e;
    }

    const ok = await bcrypt.compare(dto.contrasenia, u.contraseniaHash);
    if (!ok) {
      const e: any = new Error("Credenciales inválidas");
      e.statusCode = 401;
      throw e;
    }

    const token = jwt.sign(aPublico(u), JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return { token, usuario: aPublico(u) };
  },

  /** Devuelve el usuario autenticado (ya viene del middleware de auth) */
  perfil(desdeToken: UsuarioAutenticado): UsuarioAutenticado {
    return desdeToken;
  },
};
