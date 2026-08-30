import { Router } from 'express'
import Program from '../../models/Program.js'
import { makePublicContentController } from '../../controllers/publicContent.controller.js'

const router = Router()
const { list, getBySlug } = makePublicContentController(Program, { filterableFields: ['pillar'] })

router.get('/', list)
router.get('/:slug', getBySlug)

export default router
