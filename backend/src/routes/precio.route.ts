import { Router } from "express";
import { obtenerPrecio, actualizarPrecio, cotizar } from "../controllers/precio.controller";

export const precioRoutes = Router();

// GET /api/precios
precioRoutes.get("/", obtenerPrecio);

// PATCH /api/precios          (ideal: protegido con ADMIN)
precioRoutes.patch("/", /* autenticado, requiereRol('ADMIN'), */ actualizarPrecio);

// POST /api/cotizaciones     (cotiza total por rango)
precioRoutes.post("/cotizaciones", cotizar);