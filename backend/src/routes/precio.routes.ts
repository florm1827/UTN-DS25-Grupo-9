import { Router } from "express";
import { obtenerPrecio, actualizarPrecio, cotizar } from "../controllers/precio.controller";
import { autenticado, requiereRol } from "../middlewares/auth.middleware";

export const precioRoutes = Router();
//solo admin
precioRoutes.patch("/", autenticado, requiereRol("ADMIN"), actualizarPrecio);

// GET /api/precios
precioRoutes.get("/", obtenerPrecio);

// PATCH /api/precios          (ideal: protegido con ADMIN)
precioRoutes.patch("/", /* autenticado, requiereRol('ADMIN'), */ actualizarPrecio);

// POST /api/cotizaciones     (cotiza total por rango)
precioRoutes.post("/cotizaciones", cotizar);