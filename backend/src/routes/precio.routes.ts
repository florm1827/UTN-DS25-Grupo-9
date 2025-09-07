import { Router } from "express";
import { obtenerPrecio, actualizarPrecio, cotizar } from "../controllers/precio.controller";
import { autenticado, requiereRol } from "../middlewares/auth.middleware";
import { validarBody } from "../middlewares/validation.middleware";
import { actualizarPrecioSchema, cotizacionSchema } from "../validations/precio.validation";

export const precioRoutes = Router();

// GET /api/precios
precioRoutes.get("/", obtenerPrecio);

// PATCH /api/precios   (solo ADMIN)
precioRoutes.patch("/", autenticado, requiereRol("ADMIN"), validarBody(actualizarPrecioSchema), actualizarPrecio);

// POST /api/precios/cotizaciones
precioRoutes.post("/cotizaciones", validarBody(cotizacionSchema), cotizar);
