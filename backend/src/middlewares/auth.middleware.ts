import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UsuarioAutenticado } from "../types/usuario.types";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export function autenticado(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization; // "Bearer <token>"
    if (!auth?.startsWith("Bearer ")) {
      const e:any=new Error("No autorizado"); e.statusCode=401; throw e;
    }
    const token = auth.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as UsuarioAutenticado;

    req.usuario = payload; // adjuntamos el usuario al request
    next();
  } catch (err) {
    (err as any).statusCode = (err as any).statusCode || 401;
    next(err);
  }
}

export function requiereRol(rol: "ADMIN" | "USUARIO") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.usuario;
    if (!user) { const e:any=new Error("No autorizado"); e.statusCode=401; throw e; }
    if (user.rol !== rol) { const e:any=new Error("Permisos insuficientes"); e.statusCode=403; throw e; }
    next();
  };
}
