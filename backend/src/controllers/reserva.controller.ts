// src/controllers/reserva.controller.ts
import { Request, Response, NextFunction } from "express";
import { ReservaService } from "../services/reserva.service";
import { PrecioService } from "../services/precio.service";

export const listarReservas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filtro = {
      fecha: req.query.fecha?.toString(),
      estado: req.query.estado as any,          // "PENDIENTE" | "ACEPTADA" | ...
      canchaId: req.query.canchaId?.toString(),
      mias: req.query.mias === "true",
      usuarioId: (req as any).usuario?.id ?? undefined
    };

    const data = await ReservaService.listar(filtro);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const crearReserva = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.body as {
      canchaId: string;
      inicio: string;
      fin: string;
      nombreMostrar: string;
    };

    const usuarioId = (req as any).usuario?.id;

    // Cotizamos
    const cotizacion = PrecioService.cotizar({
      canchaId: dto.canchaId,
      inicio: dto.inicio,
      fin: dto.fin
    });

    // Creamos la solicitud
    const creada = await ReservaService.crear(dto, usuarioId);

    res.status(201).json({
      id: creada.id,
      estado: creada.estado,
      cotizacion,
      mensaje: "Solicitud creada correctamente"
    });
  } catch (err) {
    next(err);
  }
};

export const actualizarEstadoReserva = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const body = req.body as {
      estado: "ACEPTADA" | "RECHAZADA" | "CANCELADA";
      motivoRechazo?: string;
    };

    const actorId = (req as any).usuario?.id;
    const esAdmin = (req as any).usuario?.rol === "ADMIN";

    const r = await ReservaService.actualizarEstado(id, body.estado, actorId, esAdmin);
    res.json(r);
  } catch (err) {
    next(err);
  }
};
