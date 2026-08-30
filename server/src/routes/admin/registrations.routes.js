import { Router } from 'express'
import Registration from '../../models/Registration.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { apiSuccess, apiError } from '../../utils/apiResponse.js'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    const items = await Registration.find(filter).sort({ createdAt: -1 }).populate('programRef', 'title')
    return apiSuccess(res, { data: items })
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const item = await Registration.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!item) return apiError(res, { message: 'الطلب غير موجود.', status: 404 })
    return apiSuccess(res, { data: item, message: 'تم تحديث حالة الطلب.' })
  } catch (err) {
    next(err)
  }
})

export default router
