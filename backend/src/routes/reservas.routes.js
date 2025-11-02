import { Router } from 'express'

const router = Router()

// GET /api/reservas
router.get('/', (req, res) => {
  res.json({ ok: true, data: [] })
})

// POST /api/reservas
router.post('/', (req, res) => {
  res.json({ ok: true, msg: 'crear reserva pending' })
})

export default router
