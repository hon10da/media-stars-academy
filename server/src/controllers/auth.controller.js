import { apiSuccess, apiError } from '../utils/apiResponse.js'
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/token.js'
import { verifyAdminCredentials } from '../services/auth.service.js'

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const admin = await verifyAdminCredentials(email, password)

    if (!admin) {
      return apiError(res, { message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', status: 401 })
    }

    const token = generateToken({ id: admin._id.toString() })
    setAuthCookie(res, token)

    return apiSuccess(res, { data: admin.toJSON(), message: 'تم تسجيل الدخول بنجاح.' })
  } catch (err) {
    next(err)
  }
}

export async function logout(req, res) {
  clearAuthCookie(res)
  return apiSuccess(res, { message: 'تم تسجيل الخروج بنجاح.' })
}

export async function me(req, res) {
  return apiSuccess(res, { data: req.admin.toJSON() })
}
