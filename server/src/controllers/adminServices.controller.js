import Service from '../models/Service.js'
import Department from '../models/Department.js'
import { apiSuccess, apiError } from '../utils/apiResponse.js'

export async function list(req, res, next) {
  try {
    const services = await Service.find().populate('departmentRef', 'name slug').sort({ order: 1 })
    return apiSuccess(res, { data: services })
  } catch (err) {
    next(err)
  }
}

export async function getOne(req, res, next) {
  try {
    const service = await Service.findById(req.params.id).populate('departmentRef', 'name slug')
    if (!service) return apiError(res, { message: 'الخدمة غير موجودة.', status: 404 })
    return apiSuccess(res, { data: service })
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    if (!req.body.departmentRef) {
      return apiError(res, { message: 'يجب تحديد القسم (departmentRef) لإنشاء الخدمة.', status: 400 })
    }

    const department = await Department.findById(req.body.departmentRef)
    if (!department) {
      return apiError(res, { message: 'القسم المحدد (departmentRef) غير موجود.', status: 400 })
    }

    const service = await Service.create(req.body)
    return apiSuccess(res, { data: service, message: 'تم إنشاء الخدمة بنجاح.', status: 201 })
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    if (req.body.departmentRef) {
      const department = await Department.findById(req.body.departmentRef)
      if (!department) {
        return apiError(res, { message: 'القسم المحدد (departmentRef) غير موجود.', status: 400 })
      }
    }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!service) return apiError(res, { message: 'الخدمة غير موجودة.', status: 404 })
    return apiSuccess(res, { data: service, message: 'تم تحديث الخدمة بنجاح.' })
  } catch (err) {
    next(err)
  }
}

// Matches the existing hard-delete convention used by Program/Trainer/Media/Testimonial.
export async function remove(req, res, next) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) return apiError(res, { message: 'الخدمة غير موجودة.', status: 404 })
    return apiSuccess(res, { message: 'تم حذف الخدمة بنجاح.' })
  } catch (err) {
    next(err)
  }
}
