import { apiSuccess, apiError } from '../utils/apiResponse.js'

// Generic authenticated CRUD controller factory for admin-managed resources
// (Program, Trainer, MediaPost, Testimonial). Full field-level validation per
// resource can be layered on with validateRequest + resource-specific zod schemas.
export function makeAdminCrudController(Model) {
  async function list(req, res, next) {
    try {
      const items = await Model.find().sort({ createdAt: -1 })
      return apiSuccess(res, { data: items })
    } catch (err) {
      next(err)
    }
  }

  async function getOne(req, res, next) {
    try {
      const item = await Model.findById(req.params.id)
      if (!item) return apiError(res, { message: 'العنصر غير موجود.', status: 404 })
      return apiSuccess(res, { data: item })
    } catch (err) {
      next(err)
    }
  }

  async function create(req, res, next) {
    try {
      const item = await Model.create(req.body)
      return apiSuccess(res, { data: item, message: 'تم الإنشاء بنجاح.', status: 201 })
    } catch (err) {
      next(err)
    }
  }

  async function update(req, res, next) {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      if (!item) return apiError(res, { message: 'العنصر غير موجود.', status: 404 })
      return apiSuccess(res, { data: item, message: 'تم التحديث بنجاح.' })
    } catch (err) {
      next(err)
    }
  }

  async function remove(req, res, next) {
    try {
      const item = await Model.findByIdAndDelete(req.params.id)
      if (!item) return apiError(res, { message: 'العنصر غير موجود.', status: 404 })
      return apiSuccess(res, { message: 'تم الحذف بنجاح.' })
    } catch (err) {
      next(err)
    }
  }

  return { list, getOne, create, update, remove }
}
