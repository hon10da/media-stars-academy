import Department from '../models/Department.js'
import Service from '../models/Service.js'
import { apiSuccess, apiError } from '../utils/apiResponse.js'

export async function list(req, res, next) {
  try {
    const departments = await Department.find().sort({ order: 1 })
    return apiSuccess(res, { data: departments })
  } catch (err) {
    next(err)
  }
}

export async function getOne(req, res, next) {
  try {
    const department = await Department.findById(req.params.id)
    if (!department) return apiError(res, { message: 'القسم غير موجود.', status: 404 })
    return apiSuccess(res, { data: department })
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    const department = await Department.create(req.body)
    return apiSuccess(res, { data: department, message: 'تم إنشاء القسم بنجاح.', status: 201 })
  } catch (err) {
    next(err)
  }
}

export async function update(req, res, next) {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!department) return apiError(res, { message: 'القسم غير موجود.', status: 404 })
    return apiSuccess(res, { data: department, message: 'تم تحديث القسم بنجاح.' })
  } catch (err) {
    next(err)
  }
}

// Prevent deleting a Department that still has Services referencing it —
// avoids leaving broken Service.departmentRef pointers behind, matching
// the project's convention of hard-delete (no soft-delete/deactivate pattern
// exists elsewhere in this codebase), guarded by a referential-integrity check.
export async function remove(req, res, next) {
  try {
    const department = await Department.findById(req.params.id)
    if (!department) return apiError(res, { message: 'القسم غير موجود.', status: 404 })

    const linkedServicesCount = await Service.countDocuments({ departmentRef: department._id })

    if (linkedServicesCount > 0) {
      return apiError(res, {
        message: `لا يمكن حذف هذا القسم لأنه مرتبط بـ ${linkedServicesCount} خدمة/خدمات. يرجى حذف أو إعادة ربط الخدمات أولًا.`,
        status: 409,
      })
    }

    await Department.findByIdAndDelete(req.params.id)
    return apiSuccess(res, { message: 'تم حذف القسم بنجاح.' })
  } catch (err) {
    next(err)
  }
}
