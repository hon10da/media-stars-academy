import { apiError } from '../utils/apiResponse.js'

// Usage: router.post('/x', validateRequest(schema), controller)
export function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return apiError(res, {
        message: 'بيانات غير صالحة، برجاء مراجعة الحقول المطلوبة.',
        status: 400,
        errors: result.error.flatten(),
      })
    }
    req.body = result.data
    next()
  }
}
