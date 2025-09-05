import { Router } from "express";
import { listarCanchas, actualizarEstadoCancha } from "../controllers/cancha.controller";

export const canchaRoutes = Router();


canchaRoutes.get("/", listarCanchas);

canchaRoutes.patch("/:id/estado", /* autenticado, requiereRol('ADMIN'), */ actualizarEstadoCancha);