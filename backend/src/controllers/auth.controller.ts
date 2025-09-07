import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { InicioSesionDTO, RegistroDTO } from "../types/usuario.types";

export const registrar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body as RegistroDTO;
    const resp = await AuthService.registrar(dto);
    res.status(201).json(resp);
  } catch (err) { next(err); }
};

export const iniciarSesion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body as InicioSesionDTO;
    const resp = await AuthService.iniciarSesion(dto);
    res.json(resp);
  } catch (err) { next(err); }
};

export const miPerfil = (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.usuario lo adjunta el middleware autenticado
    if (!req.usuario) { const e:any=new Error("No autorizado"); e.statusCode=401; throw e; }
    res.json(req.usuario);
  } catch (err) { next(err); }
};
