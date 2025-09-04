import { Router } from "express";
import { listarReservas, crearReserva, actualizarEstadoReserva } from "../controllers/reserva.controller";

export const reservaRoutes = Router();

// GET /api/reservas?fecha&estado&canchaId&mias
reservaRoutes.get("/", listarReservas);

// POST /api/reservas
// (ideal: requerir auth para asignar usuarioId)
reservaRoutes.post("/", crearReserva);

// PATCH /api/reservas/:id/estado (ADMIN o dueño para cancelar)
reservaRoutes.patch("/:id/estado", actualizarEstadoReserva);
