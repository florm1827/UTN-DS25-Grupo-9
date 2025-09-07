import { Router } from "express";
import { obtenerDisponibilidad } from "../controllers/disponibilidad.controller";
import { validarQuery } from "../middlewares/validation.middleware";
import { disponibilidadQuerySchema } from "../validations/disponibilidad.validation";

export const disponibilidadRoutes = Router();

// GET /api/disponibilidad?fecha=YYYY-MM-DD&canchaId=?
disponibilidadRoutes.get("/", validarQuery(disponibilidadQuerySchema), obtenerDisponibilidad);
