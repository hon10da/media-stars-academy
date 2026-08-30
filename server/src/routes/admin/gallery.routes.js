import { Router } from 'express'
import multer from 'multer'
import GalleryItem from '../../models/GalleryItem.js'
import cloudinary from '../../config/cloudinary.js'
import { authMiddleware } from '../../middleware/authMiddleware.js'
import { apiSuccess, apiError } from '../../utils/apiResponse.js'

const router = Router()

router.use(authMiddleware)

// Store uploaded image temporarily in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed.'))
    }
  },
})

// Helper: upload buffer to Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'media-stars-academy/gallery',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error)
          return
        }

        resolve(result)
      }
    )

    stream.end(buffer)
  })
}

// GET /api/admin/gallery
router.get('/', async (req, res, next) => {
  try {
    const items = await GalleryItem.find().sort({
      order: 1,
      createdAt: -1,
    })

    return apiSuccess(res, { data: items })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/gallery/:id
router.get('/:id', async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id)

    if (!item) {
      return apiError(res, {
        message: 'الصورة غير موجودة.',
        status: 404,
      })
    }

    return apiSuccess(res, { data: item })
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/gallery
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return apiError(res, {
        message: 'يرجى اختيار صورة.',
        status: 400,
      })
    }

    const result = await uploadToCloudinary(req.file.buffer)

    const item = await GalleryItem.create({
      title: req.body.title || '',
      description: req.body.description || '',
      imageUrl: result.secure_url,
      publicId: result.public_id,
      showOnHome:
        req.body.showOnHome === 'true' ||
        req.body.showOnHome === '1',
      status: req.body.status === 'draft' ? 'draft' : 'published',
      order: Number(req.body.order) || 0,
    })

    return apiSuccess(res, {
      data: item,
      message: 'تم رفع الصورة وإضافتها للمعرض بنجاح.',
      status: 201,
    })
  } catch (err) {
    next(err)
  }
})

// PUT /api/admin/gallery/:id
router.put('/:id', upload.single('image'), async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id)

    if (!item) {
      return apiError(res, {
        message: 'الصورة غير موجودة.',
        status: 404,
      })
    }

    // Update text/settings
    if (req.body.title !== undefined) {
      item.title = req.body.title
    }

    if (req.body.description !== undefined) {
      item.description = req.body.description
    }

    if (req.body.showOnHome !== undefined) {
      item.showOnHome =
        req.body.showOnHome === 'true' ||
        req.body.showOnHome === '1'
    }

    if (req.body.status !== undefined) {
      item.status = req.body.status
    }

    if (req.body.order !== undefined) {
      item.order = Number(req.body.order) || 0
    }

    // Replace image if a new one was uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer)

      // Delete old image from Cloudinary
      if (item.publicId) {
        try {
          await cloudinary.uploader.destroy(item.publicId)
        } catch (deleteError) {
          console.error(
            'Failed to delete old Cloudinary image:',
            deleteError.message
          )
        }
      }

      item.imageUrl = result.secure_url
      item.publicId = result.public_id
    }

    await item.save()

    return apiSuccess(res, {
      data: item,
      message: 'تم تحديث الصورة بنجاح.',
    })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/admin/gallery/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const item = await GalleryItem.findById(req.params.id)

    if (!item) {
      return apiError(res, {
        message: 'الصورة غير موجودة.',
        status: 404,
      })
    }

    // Delete image from Cloudinary
    if (item.publicId) {
      try {
        await cloudinary.uploader.destroy(item.publicId)
      } catch (deleteError) {
        console.error(
          'Failed to delete Cloudinary image:',
          deleteError.message
        )
      }
    }

    await item.deleteOne()

    return apiSuccess(res, {
      message: 'تم حذف الصورة من المعرض بنجاح.',
    })
  } catch (err) {
    next(err)
  }
})

export default router