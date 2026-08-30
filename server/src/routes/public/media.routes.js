import { Router } from 'express'
import MediaPost from '../../models/MediaPost.js'
import { makePublicContentController } from '../../controllers/publicContent.controller.js'

const router = Router()
const { list, getBySlug } = makePublicContentController(MediaPost, { filterableFields: ['category'] })

router.get('/', list)
router.get('/:slug', getBySlug)

export default router
