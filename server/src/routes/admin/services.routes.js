import { Router } from 'express'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { list, getOne, create, update, remove } from '../../controllers/adminServices.controller.js'

const router = Router()

router.use(authMiddleware)
router.get('/', list)
router.get('/:id', getOne)
router.post('/', create)
router.put('/:id', update)
router.patch('/:id', update)
router.delete('/:id', remove)

export default router
