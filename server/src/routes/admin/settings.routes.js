import { Router } from 'express'
import SiteSettings from '../../models/SiteSettings.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { apiSuccess } from '../../utils/apiResponse.js'

const router = Router()

router.use(authMiddleware)

// Get site settings
router.get('/', async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      {},
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )

    return apiSuccess(res, { data: settings })
  } catch (err) {
    next(err)
  }
})

// Update site settings
router.put('/', async (req, res, next) => {
  try {
    const allowedFields = [
      'tagline',
      'phone',
      'whatsappNumber',
      'email',
      'address',
      'socialLinks',
      'homepageStats',
    ]

    const updateData = {}

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field]
      }
    })

    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      {
        $set: updateData,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    )

    return apiSuccess(res, {
      data: settings,
      message: 'تم تحديث إعدادات الموقع بنجاح.',
    })
  } catch (err) {
    next(err)
  }
})

export default router