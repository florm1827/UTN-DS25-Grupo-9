import { Request, Response, NextFunction } from "express";
import { CanchaService } from "../services/cancha.service";
import { ActualizarEstadoCanchaDTO } from "../types/cancha.types";

export const listarCanchas = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(CanchaService.listar());
  } catch (err) { next(err); }
};

export const actualizarEstadoCancha = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const dto = req.body as ActualizarEstadoCanchaDTO;
    const r = CanchaService.actualizarEstado(id, dto);
    res.json(r);
  } catch (err) { next(err); }
};