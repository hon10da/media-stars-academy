import { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import useSubmitForm from '@/hooks/useSubmitForm'
import { submitContactMessage } from '@/api/contact.api'

const initialState = { fullName: '', phone: '', email: '', subject: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(initialState)
  const { status, errorMessage, submit } = useSubmitForm(submitContactMessage)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    await submit(form)
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-10">
        <FaCheckCircle className="text-[var(--color-gold)]" size={48} />
        <h3 className="font-display text-xl font-bold text-navy">تم إرسال رسالتك بنجاح</h3>
        <p className="text-muted text-sm">شكرًا لتواصلك معنا، سنرد عليك في أقرب وقت.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-navy" htmlFor="c-fullName">الاسم الكامل</label>
          <input
            id="c-fullName"
            name="fullName"
            required
            value={form.fullName}
            onChange={handleChange}
            className="rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors"
            placeholder="اكتب اسمك الكامل"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-navy" htmlFor="c-phone">رقم الهاتف</label>
          <input
            id="c-phone"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-navy" htmlFor="c-email">البريد الإلكتروني</label>
          <input
            id="c-email"
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
          <label className="text-sm font-bold text-navy" htmlFor="c-subject">الموضوع</label>
          <input
            id="c-subject"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className="rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors"
            placeholder="موضوع الرسالة"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-navy" htmlFor="c-message">الرسالة</label>
        <textarea
          id="c-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors resize-none"
          placeholder="اكتب رسالتك هنا..."
        />
      </div>

      {status === 'error' && <p className="text-sm text-[var(--color-danger)]">{errorMessage}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={status === 'submitting'} className="w-full">
        {status === 'submitting' ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
      </Button>
    </form>
  )
}
