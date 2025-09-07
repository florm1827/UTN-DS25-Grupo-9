import { Request, Response, NextFunction } from "express";
import { DisponibilidadService } from "../services/disponibilidad.service";

export const obtenerDisponibilidad = (req: Request, res: Response, next: NextFunction) => {
  try {
    const fecha = req.query.fecha?.toString();
    const canchaId = req.query.canchaId?.toString();

    if (!fecha) {
      const e:any = new Error("Parámetro 'fecha' es requerido (YYYY-MM-DD)");
      e.statusCode = 400; throw e;
    }

    const data = DisponibilidadService.obtenerSlots({ fecha, canchaId });
    res.json(data);
  } catch (err) { next(err); }
};