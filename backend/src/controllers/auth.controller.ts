import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export const registrar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = (req.validated?.body ?? req.body) as {
      nombre: string;
      email: string;
      contrasenia: string;
    };
    const resp = await AuthService.registrar(body);
    res.status(201).json(resp);
  } catch (err) {
    next(err);
  }
};

export const iniciarSesion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = (req.validated?.body ?? req.body) as {
      email: string;
      contrasenia: string;
    };
    const resp = await AuthService.iniciarSesion(body);
    res.json(resp);
  } catch (err) {
    next(err);
  }
};

export const miPerfil = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.usuario) {
      const e: any = new Error("No autorizado"); e.statusCode = 401; throw e;
    }
    res.json(req.usuario);
  } catch (err) {
    next(err);
  }
};
