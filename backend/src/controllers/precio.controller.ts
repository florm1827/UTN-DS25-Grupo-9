import { Request, Response, NextFunction } from "express";
import { PrecioService } from "../services/precio.service";
import { ActualizarPrecioDTO, SolicitudCotizacionDTO } from "../types/precio.types";

export const obtenerPrecio = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(PrecioService.obtenerVigente());
  } catch (err) { next(err); }
};

export const actualizarPrecio = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body as ActualizarPrecioDTO;
    const actualizado = PrecioService.actualizar(dto);
    res.json(actualizado);
  } catch (err) { next(err); }
};

export const cotizar = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body as SolicitudCotizacionDTO;
    const resp = PrecioService.cotizar(dto);
    res.json(resp);
  } catch (err) { next(err); }
};