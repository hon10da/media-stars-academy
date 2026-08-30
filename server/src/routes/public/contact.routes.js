import { Router } from 'express'
import { createRegistration, createContactMessage } from '../../controllers/contact.controller.js'
import { validateRequest } from '../../middleware/validateRequest.js'
import { registrationSchema, contactMessageSchema } from '../../utils/validationSchemas.js'
import { publicFormRateLimiter } from '../../middleware/rateLimiter.js'

const router = Router()

router.post('/registrations', publicFormRateLimiter, validateRequest(registrationSchema), createRegistration)
router.post('/contact', publicFormRateLimiter, validateRequest(contactMessageSchema), createContactMessage)

export default router
