import { useState, useEffect } from 'react'
import { FaQuoteRight } from 'react-icons/fa'
import SectionHeading from '@/components/ui/SectionHeading'
import { AnimatedCard } from '@/components/ui/Card'
import { getTestimonials } from '@/api/testimonials.api'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setErrorMessage('')

    getTestimonials()
      .then((res) => {
        if (ignore) return
        setTestimonials(res.data?.data || [])
        setStatus('success')
      })
      .catch((err) => {
        if (ignore) return
        setErrorMessage(err?.response?.data?.message || 'تعذر تحميل آراء المتدربين، برجاء المحاولة مرة أخرى.')
        setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="py-20 md:py-28 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="آراء المتدربين"
          title="ماذا يقول المتدربون عنا"
          description="تجارب حقيقية ستظهر هنا بمجرد إضافتها من لوحة التحكم."
        />

        {status === 'loading' && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-16">
            <p className="text-[var(--color-danger)] font-bold mb-2">تعذر تحميل آراء المتدربين</p>
            <p className="text-muted text-sm">{errorMessage}</p>
          </div>
        )}

        {status === 'success' && testimonials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <AnimatedCard key={t._id || idx} delay={idx * 0.1} className="p-8 flex flex-col gap-4">
                <FaQuoteRight className="text-[var(--color-gold)]" size={22} />
                <p className="text-ink text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-navy text-sm">{t.studentName}</p>
                  <p className="text-muted text-xs">{t.role}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}

        {status === 'success' && testimonials.length === 0 && (
          <p className="text-center text-muted py-16">لا توجد آراء متاحة حاليًا.</p>
        )}
      </div>
    </section>
  )
}