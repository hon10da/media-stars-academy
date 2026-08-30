import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAdminAuth } from '@/context/AdminAuthContext'
import Button from '@/components/ui/Button'
import logo from '@/assets/images/logo.png'
import { SITE } from '@/lib/constants'

export default function AdminLogin() {
  const { login } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/admin/dashboard'

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'بيانات الدخول غير صحيحة.')
      setStatus('error')
    }
  }

  return (
    <>
      <Helmet>
        <title>تسجيل دخول الأدمن | {SITE.name}</title>
      </Helmet>
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lift p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt={SITE.name} className="h-16 w-auto mb-4" />
            <h1 className="font-display text-xl font-bold text-navy">لوحة تحكم الأدمن</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-bold text-navy">البريد الإلكتروني</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                dir="ltr"
                className="rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors"
                placeholder="admin@mediastarsacademy.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-bold text-navy">كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                dir="ltr"
                className="rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {status === 'error' && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

            <Button type="submit" variant="primary" size="lg" disabled={status === 'submitting'} className="w-full">
              {status === 'submitting' ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
