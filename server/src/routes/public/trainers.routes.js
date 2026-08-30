import { Router } from 'express'
import Trainer from '../../models/Trainer.js'
import { makePublicContentController } from '../../controllers/publicContent.controller.js'

const router = Router()
const { list, getBySlug } = makePublicContentController(Trainer, { filterableFields: ['pillars'] })

router.get('/', list)
router.get('/:slug', getBySlug)

export default router
