import Service from '../models/Service.js'
import { apiSuccess, apiError } from '../utils/apiResponse.js'

// Public: list published services, with department info populated.
// Optional ?departmentRef=<id> to narrow to one department.
export async function list(req, res, next) {
  try {
    const filter = { status: 'published' }

    if (req.query.departmentRef) {
      filter.departmentRef = req.query.departmentRef
    }

    const services = await Service.find(filter)
      .populate('departmentRef', 'name slug')
      .sort({ order: 1 })

    return apiSuccess(res, { data: services })
  } catch (err) {
    next(err)
  }
}

// Public: a single published service by slug, with department info populated.
export async function getBySlug(req, res, next) {
  try {
    const service = await Service.findOne({ slug: req.params.slug, status: 'published' }).populate(
      'departmentRef',
      'name slug'
    )

    if (!service) {
      return apiError(res, { message: 'الخدمة غير موجودة.', status: 404 })
    }

    return apiSuccess(res, { data: service })
  } catch (err) {
    next(err)
  }
}
