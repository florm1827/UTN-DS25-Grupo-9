import { Request, Response, NextFunction } from "express";
import { CanchaModel } from "../models/cancha.model";

export const listarCanchas = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const c = await CanchaModel.listar();
    res.json(c);
  } catch (err) {
    next(err);
  }
};

export const actualizarEstadoCancha = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = (req.validated?.params ?? req.params) as { id: string };
    const body = (req.validated?.body ?? req.body) as { estado: "HABILITADA" | "DESHABILITADA"; nota?: string };

    const updated = await CanchaModel.actualizarEstado(params.id, body.estado);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
