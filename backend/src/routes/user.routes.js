import { Router } from 'express'
import { deleteMe } from '../controllers/user.controller.js'
import { authRequired } from '../middlewares/auth.js'

const router = Router()

// Baja de cuenta del usuario actual
router.delete('/me', authRequired, deleteMe)

export default router
