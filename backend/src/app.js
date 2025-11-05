import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import reservasRoutes from './routes/reservas.routes.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}))

app.use(express.json())

// rutas
app.use('/api/auth', authRoutes)
app.use('/api/reservas', reservasRoutes)

export default app
