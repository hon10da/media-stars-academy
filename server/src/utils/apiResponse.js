// Consistent response envelope used across all endpoints: { success, data, message }
export function apiSuccess(res, { data = null, message = '', status = 200 } = {}) {
  return res.status(status).json({ success: true, data, message })
}

export function apiError(res, { message = 'حدث خطأ ما', status = 500, errors = null } = {}) {
  return res.status(status).json({ success: false, message, errors })
}
