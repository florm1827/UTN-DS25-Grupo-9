import { Router } from "express";
import { listarCanchas, actualizarEstadoCancha } from "../controllers/cancha.controller";
import { autenticado, requiereRol } from "../middlewares/auth.middleware";
import { validarBody, validarParams } from "../middlewares/validation.middleware";
import { cambiarEstadoBodySchema, cambiarEstadoParamsSchema } from "../validations/cancha.validation";

export const canchaRoutes = Router();

// GET /api/canchas
canchaRoutes.get("/", listarCanchas);

// PATCH /api/canchas/:id/estado   (solo ADMIN)
canchaRoutes.patch(
  "/:id/estado",
  autenticado,
  requiereRol("ADMIN"),
  validarParams(cambiarEstadoParamsSchema),
  validarBody(cambiarEstadoBodySchema),
  actualizarEstadoCancha
);
