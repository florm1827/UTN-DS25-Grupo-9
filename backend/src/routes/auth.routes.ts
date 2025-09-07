import { Router } from "express";
import { iniciarSesion, miPerfil, registrar } from "../controllers/auth.controller";
import { autenticado } from "../middlewares/auth.middleware";
import { validarBody } from "../middlewares/validation.middleware";
import { inicioSesionSchema, registroSchema } from "../validations/auth.validation";

export const authRoutes = Router();

// POST /api/autenticacion/registro
authRoutes.post("/registro", validarBody(registroSchema), registrar);

// POST /api/autenticacion/inicio-sesion
authRoutes.post("/inicio-sesion", validarBody(inicioSesionSchema), iniciarSesion);

// GET /api/autenticacion/mi-perfil  (requiere token)
authRoutes.get("/mi-perfil", autenticado, miPerfil);
