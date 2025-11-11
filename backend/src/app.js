import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import reservasRoutes from './routes/reservas.routes.js'
import userRoutes from './routes/user.routes.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173'],
  credentials: true,
}))

app.use(express.json())

// rutas
app.use('/api/auth', authRoutes)
app.use('/api/reservas', reservasRoutes)
app.use('/api/users', userRoutes)
app.get('/', (req, res) => {
  res.send('Backend funcionando ');
});

export default app
