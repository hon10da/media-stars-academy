import { Router } from 'express'
import Testimonial from '../../models/Testimonial.js'
import { apiSuccess } from '../../utils/apiResponse.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: 'published' }).sort({ order: 1, createdAt: -1 })
    return apiSuccess(res, { data: testimonials })
  } catch (err) {
    next(err)
  }
})

export default router
