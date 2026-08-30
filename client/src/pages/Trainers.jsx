import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import PageHero from '@/components/sections/PageHero'
import TrainerCard from '@/components/trainers/TrainerCard'
import { SITE } from '@/lib/constants'
import { getTrainers } from '@/api/trainers.api'

export default function Trainers() {
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
        setTrainers(res.data?.data || [])
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
    <>
      <Helmet>
        <title>المدربون | {SITE.name}</title>
      </Helmet>

      <PageHero
        title="المدربون"
        description="نخبة من المدربين المتخصصين في مجالات الإعلام، الصحة النفسية، الإرشاد الأسري، والتعليم والتطوير."
      />

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer, idx) => (
                <TrainerCard key={trainer.slug} trainer={trainer} delay={idx * 0.08} />
              ))}
            </div>
          )}

          {status === 'success' && trainers.length === 0 && (
            <p className="text-center text-muted py-16">لا يوجد مدربون متاحون حاليًا.</p>
          )}
        </div>
      </section>
    </>
  )
}