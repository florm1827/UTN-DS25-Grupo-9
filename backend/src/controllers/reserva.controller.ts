// src/controllers/reserva.controller.ts
import { Request, Response, NextFunction } from "express";
import { ReservaService } from "../services/reserva.service";
import {
  ActualizarEstadoReservaDTO,
  CrearReservaDTO,
  FiltroReservas
} from "../types/reserva.types";
import { PrecioService } from "../services/precio.service"; // ⬅️ nuevo

export const listarReservas = (req: Request, res: Response, next: NextFunction) => {
  try {
    const filtro: FiltroReservas = {
      fecha: req.query.fecha?.toString(),
      estado: req.query.estado as any,
      canchaId: req.query.canchaId?.toString(),
      mias: req.query.mias === "true",
      usuarioId: (req as any).usuario?.id
    };
    const data = ReservaService.listar(filtro);
    res.json(data);
  } catch (err) { next(err); }
};

export const crearReserva = (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body as CrearReservaDTO;
    const usuarioId = (req as any).usuario?.id;

    // 1) Cotizamos (valida rango y múltiplos de 30’)
    const cotizacion = PrecioService.cotizar({
      canchaId: dto.canchaId,
      inicio: dto.inicio,
      fin: dto.fin
    });

    // 2) Creamos la solicitud (re-valida solapes con ACEPTADAS, etc.)
    const creada = ReservaService.crear(dto, usuarioId);

    // 3) Devolvemos la cotización + mensaje
    res.status(201).json({
      id: creada.id,
      estado: creada.estado,
      cotizacion, // ⬅️ incluimos bloques, total, moneda, etc.
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
