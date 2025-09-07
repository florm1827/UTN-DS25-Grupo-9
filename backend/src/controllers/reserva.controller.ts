import { Request, Response, NextFunction } from "express";
import { ReservaService } from "../services/reserva.service";
import { PrecioService } from "../services/precio.service";

export const listarReservas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.validated?.query ?? req.query) as {
      fecha?: string;
      estado?: "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "CANCELADA";
      canchaId?: string;
      mias?: boolean;
    };

    const filtro = {
      fecha: q.fecha,
      estado: q.estado,
      canchaId: q.canchaId,
      mias: q.mias === true,
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
    const body = (req.validated?.body ?? req.body) as {
      canchaId: string;
      inicio: string;
      fin: string;
      nombreMostrar: string;
    };

    const usuarioId = (req as any).usuario?.id;

    const cotizacion = PrecioService.cotizar({
      canchaId: body.canchaId,
      inicio: body.inicio,
      fin: body.fin
    });

    const creada = await ReservaService.crear(body, usuarioId);

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
    const params = (req.validated?.params ?? req.params) as { id: string };
    const body = (req.validated?.body ?? req.body) as {
      estado: "ACEPTADA" | "RECHAZADA" | "CANCELADA";
      motivoRechazo?: string;
    };

    const actorId = (req as any).usuario?.id;
    const esAdmin = (req as any).usuario?.rol === "ADMIN";

    const r = await ReservaService.actualizarEstado(params.id, body.estado, actorId, esAdmin);
    res.json(r);
  } catch (err) {
    next(err);
  }
};
