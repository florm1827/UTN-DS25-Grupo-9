import { Request, Response, NextFunction } from "express";
import { ReservaService } from "../services/reserva.service";
import {
  ActualizarEstadoReservaDTO,
  CrearReservaDTO,
  FiltroReservas
} from "../types/reserva.types";

export const listarReservas = (req: Request, res: Response, next: NextFunction) => {
  try {
    const filtro: FiltroReservas = {
      fecha: req.query.fecha?.toString(),
      estado: req.query.estado as any,
      canchaId: req.query.canchaId?.toString(),
      mias: req.query.mias === "true",
      usuarioId: (req as any).usuario?.id // middleware de auth setea req.usuario
    };  
    const data = ReservaService.listar(filtro);
    res.json(data);
  } catch (err) { next(err); }
};

export const crearReserva = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body as CrearReservaDTO;
    const usuarioId = (req as any).usuario?.id; 
    const creada = ReservaService.crear(dto, usuarioId);
    res.status(201).json({
      id: creada.id,
      estado: creada.estado,
      mensaje: "Solicitud creada correctamente"
    });
  } catch (err) { next(err); }
};

export const actualizarEstadoReserva = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const dto = req.body as ActualizarEstadoReservaDTO;
    const actorId = (req as any).usuario?.id;
    const esAdmin = (req as any).usuario?.rol === "ADMIN";
    const r = ReservaService.actualizarEstado(id, dto, actorId, esAdmin);
    res.json(r);
  } catch (err) { next(err); }
};
