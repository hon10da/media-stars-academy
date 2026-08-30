import rateLimit from 'express-rate-limit'

// Applied to public form-submission endpoints (registrations, contact) to prevent spam/abuse.
export const publicFormRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 submissions per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم إرسال عدد كبير من الطلبات، برجاء المحاولة لاحقًا.',
    data: null,
  },
})

// Slightly stricter limiter for the admin login endpoint to reduce brute-force risk.
export const adminLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'تم تجاوز عدد محاولات تسجيل الدخول، برجاء المحاولة لاحقًا.',
    data: null,
  },
})
