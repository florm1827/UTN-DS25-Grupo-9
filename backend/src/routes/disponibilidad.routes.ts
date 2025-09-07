import { Router } from "express";
import { obtenerDisponibilidad } from "../controllers/disponibilidad.controller";

export const disponibilidadRoutes = Router();

// GET /api/disponibilidad?fecha=YYYY-MM-DD&canchaId=?
disponibilidadRoutes.get("/", obtenerDisponibilidad);
