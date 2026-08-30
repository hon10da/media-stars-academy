import { useState, useEffect } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import TrainerCard from '@/components/trainers/TrainerCard'
import { getTrainers } from '@/api/trainers.api'

export default function TrainersPreview() {
  const [trainers, setTrainers] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setErrorMessage('')

    getTrainers()
      .then((res) => {
        if (ignore) return
        setTrainers((res.data?.data || []).slice(0, 3))
        setStatus('success')
      })
      .catch((err) => {
        if (ignore) return
        setErrorMessage(err?.response?.data?.message || 'تعذر تحميل المدربين، برجاء المحاولة مرة أخرى.')
        setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="فريقنا"
          title="نخبة من المدربين المتخصصين"
          description="مدربون متخصصون في المجالات الأربعة يقودون رحلتك التدريبية."
        />

        {status === 'loading' && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-16">
            <p className="text-[var(--color-danger)] font-bold mb-2">تعذر تحميل المدربين</p>
            <p className="text-muted text-sm">{errorMessage}</p>
          </div>
        )}

        {status === 'success' && trainers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {trainers.map((trainer, idx) => (
              <TrainerCard key={trainer.slug} trainer={trainer} delay={idx * 0.1} />
            ))}
          </div>
        )}

        {status === 'success' && trainers.length === 0 && (
          <p className="text-center text-muted py-16">لا يوجد مدربون متاحون حاليًا.</p>
        )}

        <div className="flex justify-center">
          <Button to="/trainers" variant="outline" size="md">
            عرض جميع المدربين
          </Button>
        </div>
      </div>
    </section>
  )
}