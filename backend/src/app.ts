// src/app.ts (fragmento)
import express from "express";
import { handleError } from "./middlewares/error.middleware";
import { logRequest } from "./middlewares/logger.middleware";
import { reservaRoutes } from "./routes/reserva.routes";

const app = express();
const PORT = 3000;

// Middlewares globales
app.use(express.json());
app.use(logRequest);

// Rutas
app.use("/api/reservas", reservaRoutes);

// Error handler (siempre al final)
app.use(handleError);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
