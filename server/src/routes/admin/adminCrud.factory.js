import { Router } from 'express'
import { makeAdminCrudController } from '../../controllers/adminCrud.controller.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'

// Mounts standard authenticated CRUD routes for a given Mongoose model.
export function makeAdminCrudRouter(Model) {
  const router = Router()
  const { list, getOne, create, update, remove } = makeAdminCrudController(Model)

  router.use(authMiddleware)
  router.get('/', list)
  router.get('/:id', getOne)
  router.post('/', create)
  router.put('/:id', update)
  router.delete('/:id', remove)

  return router
}
