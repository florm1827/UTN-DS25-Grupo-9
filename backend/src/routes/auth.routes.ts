import { Router } from "express";
import { iniciarSesion, miPerfil, registrar } from "../controllers/auth.controller";
import { autenticado } from "../middlewares/auth.middleware";

export const authRoutes = Router();

authRoutes.post("/registro", registrar);
authRoutes.post("/inicio-sesion", iniciarSesion);
authRoutes.get("/mi-perfil", autenticado, miPerfil);
