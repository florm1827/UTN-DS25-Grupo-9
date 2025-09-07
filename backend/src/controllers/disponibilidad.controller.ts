import { Request, Response, NextFunction } from "express";
import { DisponibilidadService } from "../services/disponibilidad.service";

export const obtenerDisponibilidad = (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.validated?.query ?? req.query) as {
      fecha: string;       // YYYY-MM-DD
      canchaId?: string;
    };

    const data = DisponibilidadService.obtenerSlots({
      fecha: q.fecha,
      canchaId: q.canchaId
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};
