import { Router } from 'express'
import GalleryItem from '../../models/GalleryItem.js'
import { apiSuccess } from '../../utils/apiResponse.js'

const router = Router()

// GET /api/gallery
router.get('/', async (req, res, next) => {
  try {
    const filter = {
      status: 'published',
    }

    if (req.query.home === 'true') {
      filter.showOnHome = true
    }

    const items = await GalleryItem.find(filter).sort({
      order: 1,
      createdAt: -1,
    })

    return apiSuccess(res, {
      data: items,
    })
  } catch (err) {
    next(err)
  }
})

export default router