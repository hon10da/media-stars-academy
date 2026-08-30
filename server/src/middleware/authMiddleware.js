import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'
import { apiError } from '../utils/apiResponse.js'
import { AUTH_COOKIE_NAME } from '../utils/token.js'

export async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME]

    if (!token) {
      return apiError(res, { message: 'غير مصرح لك بالوصول، برجاء تسجيل الدخول.', status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const admin = await Admin.findById(decoded.id)

    if (!admin) {
      return apiError(res, { message: 'حساب الأدمن غير موجود.', status: 401 })
    }

    req.admin = admin
    next()
  } catch {
    return apiError(res, { message: 'جلسة الدخول غير صالحة أو منتهية.', status: 401 })
  }
}
