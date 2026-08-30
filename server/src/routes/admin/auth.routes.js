import { Router } from 'express'
import { login, logout, me } from '../../controllers/auth.controller.js'
import { validateRequest } from '../../middleware/validateRequest.js'
import { loginSchema } from '../../utils/validationSchemas.js'
import { adminLoginRateLimiter } from '../../middleware/rateLimiter.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

const router = Router()

router.post('/login', adminLoginRateLimiter, validateRequest(loginSchema), login)
router.post('/logout', logout)
router.get('/me', authMiddleware, me)

export default router
