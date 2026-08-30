import Department from '../models/Department.js'
import Service from '../models/Service.js'
import { apiSuccess, apiError } from '../utils/apiResponse.js'

// Public: list published departments, sorted by admin-controlled order.
export async function list(req, res, next) {
  try {
    const departments = await Department.find({ status: 'published' }).sort({ order: 1 })
    return apiSuccess(res, { data: departments })
  } catch (err) {
    next(err)
  }
}

// Public: a single published department by slug.
export async function getBySlug(req, res, next) {
  try {
    const department = await Department.findOne({ slug: req.params.slug, status: 'published' })

    if (!department) {
      return apiError(res, { message: 'القسم غير موجود.', status: 404 })
    }

    return apiSuccess(res, { data: department })
  } catch (err) {
    next(err)
  }
}

// Public: published services belonging to a published department, sorted by order.
export async function getServicesByDepartmentSlug(req, res, next) {
  try {
    const department = await Department.findOne({ slug: req.params.slug, status: 'published' })

    if (!department) {
      return apiError(res, { message: 'القسم غير موجود.', status: 404 })
    }

    const services = await Service.find({ departmentRef: department._id, status: 'published' }).sort({
      order: 1,
    })

    return apiSuccess(res, { data: services })
  } catch (err) {
    next(err)
  }
}
