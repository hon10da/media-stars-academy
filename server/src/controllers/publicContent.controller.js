import { apiSuccess, apiError } from '../utils/apiResponse.js'

// Generic read-only controller factory for public content endpoints
// (Program, Trainer, MediaPost, Testimonial). Only returns published documents.
export function makePublicContentController(Model, { slugField = 'slug', filterableFields = [] } = {}) {
  async function list(req, res, next) {
    try {
      const filter = { status: 'published' }

      filterableFields.forEach((field) => {
        if (req.query[field]) filter[field] = req.query[field]
      })

      if (req.query.featured === 'true') filter.isFeatured = true

      const items = await Model.find(filter).sort({ createdAt: -1 })

      return apiSuccess(res, { data: items })
    } catch (err) {
      next(err)
    }
  }

  async function getBySlug(req, res, next) {
    try {
      const item = await Model.findOne({
        [slugField]: req.params.slug,
        status: 'published',
      })

      if (!item) {
        return apiError(res, {
          message: 'العنصر غير موجود.',
          status: 404,
        })
      }

      return apiSuccess(res, { data: item })
    } catch (err) {
      next(err)
    }
  }

  return { list, getBySlug }
}