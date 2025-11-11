import { Router } from 'express'
import { login, me, register } from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validate.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'
import { authRequired } from '../middlewares/auth.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authRequired(), me)


export default router
