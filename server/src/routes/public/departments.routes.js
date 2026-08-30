import { Router } from 'express'
import { list, getBySlug, getServicesByDepartmentSlug } from '../../controllers/departmentController.js'

const router = Router()

router.get('/', list)
router.get('/:slug/services', getServicesByDepartmentSlug)
router.get('/:slug', getBySlug)

export default router
