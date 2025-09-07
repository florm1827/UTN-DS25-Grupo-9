// src/app.ts (fragmento)
import express from "express";
import { handleError } from "./middlewares/error.middleware";
import { logRequest } from "./middlewares/logger.middleware";
import { reservaRoutes } from "./routes/reserva.routes";
import { canchaRoutes } from "./routes/cancha.routes";
import { precioRoutes } from "./routes/precio.routes";
import { authRoutes } from "./routes/auth.routes";
import bcrypt from "bcryptjs";
import { UsuarioModel } from "./models/usuario.model";
import { disponibilidadRoutes } from "./routes/disponibilidad.routes";

// (async () => {
//   const email = "admin@demo.com";
//   if (!UsuarioModel.obtenerPorEmail(email)) {
//     const hash = await bcrypt.hash("admin123", 10);
//     UsuarioModel.crear({
//       id: "admin-1",
//       nombre: "Admin",
//       email,
//       rol: "ADMIN",
//       contraseniaHash: hash,
//       creadoEn: new Date().toISOString(),
//       actualizadoEn: new Date().toISOString()
//     });
//     console.log("✅ Usuario ADMIN sembrado (admin@demo.com / admin123)");
//   }
// })();

const app = express();
const PORT = 3000;

// Middlewares globales
app.use(express.json());
app.use(logRequest);

// Rutas
app.use("/api/autenticacion", authRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/cancha", canchaRoutes);
app.use("/api/precios", precioRoutes);
app.use("/api/disponibilidad", disponibilidadRoutes);

// Error handler (siempre al final)
app.use(handleError);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
app.use("/api/precios", precioRoutes); // incluye GET/PATCH y POST /api/precios/cotizaciones