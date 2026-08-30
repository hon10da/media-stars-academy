import { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import useSubmitForm from '@/hooks/useSubmitForm'
import { submitRegistration } from '@/api/contact.api'

const initialState = { fullName: '', phone: '', email: '', message: '' }

export default function RegistrationForm() {
  const [form, setForm] = useState(initialState)
  const { status, errorMessage, submit } = useSubmitForm(submitRegistration)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submit({ ...form, preferredContactMethod: 'form' })
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-10">
        <FaCheckCircle className="text-[var(--color-gold)]" size={48} />
        <h3 className="font-display text-xl font-bold text-navy">تم إرسال طلبك بنجاح</h3>
        <p className="text-muted text-sm">سيتواصل معك فريقنا في أقرب وقت ممكن.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-navy" htmlFor="fullName">الاسم الكامل</label>
          <input
            id="fullName"
            name="fullName"
            required
            value={form.fullName}
            onChange={handleChange}
            className="rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors"
            placeholder="اكتب اسمك الكامل"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-navy" htmlFor="phone">رقم الهاتف</label>
          <input
            id="phone"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors"
            placeholder="01xxxxxxxxx"
            dir="ltr"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-navy" htmlFor="email">البريد الإلكتروني (اختياري)</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors"
          placeholder="example@email.com"
          dir="ltr"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-navy" htmlFor="message">ملاحظات إضافية (اختياري)</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors resize-none"
          placeholder="أخبرنا عن البرنامج الذي تهتم به..."
        />
      </div>

      {status === 'error' && <p className="text-sm text-[var(--color-danger)]">{errorMessage}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={status === 'submitting'} className="w-full">
        {status === 'submitting' ? 'جارٍ الإرسال...' : 'إرسال طلب التسجيل'}
      </Button>
    </form>
  )
}
