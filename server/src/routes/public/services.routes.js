import { Router } from 'express'
import { list, getBySlug } from '../../controllers/serviceController.js'

const router = Router()

router.get('/', list)
router.get('/:slug', getBySlug)

export default router
