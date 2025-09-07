import { Router } from "express";
import { listarReservas, crearReserva, actualizarEstadoReserva } from "../controllers/reserva.controller";
import { autenticado } from "../middlewares/auth.middleware";
import { validarBody, validarParams, validarQuery } from "../middlewares/validation.middleware";
import {
  crearReservaSchema,
  listarReservasQuerySchema,
  actualizarEstadoBodySchema,
  actualizarEstadoParamsSchema
} from "../validations/reserva.validation";

export const reservaRoutes = Router();

// GET /api/reservas?fecha&estado&canchaId&mias
reservaRoutes.get("/", validarQuery(listarReservasQuerySchema), listarReservas);

// POST /api/reservas  (requiere usuario logueado)
reservaRoutes.post("/", autenticado, validarBody(crearReservaSchema), crearReserva);

// PATCH /api/reservas/:id/estado  (usuario: puede CANCELAR la suya; ADMIN: aceptar/rechazar)
reservaRoutes.patch(
  "/:id/estado",
  autenticado,
  validarParams(actualizarEstadoParamsSchema),
  validarBody(actualizarEstadoBodySchema),
  actualizarEstadoReserva
);
