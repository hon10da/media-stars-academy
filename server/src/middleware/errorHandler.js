import { apiError } from '../utils/apiResponse.js'

export function notFoundHandler(req, res) {
  return apiError(res, { message: `المسار غير موجود: ${req.originalUrl}`, status: 404 })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('❌ Unhandled error:', err)

  if (err.name === 'ValidationError') {
    return apiError(res, { message: 'بيانات غير صالحة.', status: 400, errors: err.errors })
  }

  if (err.code === 11000) {
    return apiError(res, { message: 'هذا العنصر موجود بالفعل (قيمة مكررة).', status: 409 })
  }

  return apiError(res, {
    message: err.message || 'حدث خطأ في الخادم.',
    status: err.status || 500,
  })
}
