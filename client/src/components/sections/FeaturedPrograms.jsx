import { useState, useEffect } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import ProgramCard from '@/components/programs/ProgramCard'
import { getPrograms } from '@/api/programs.api'

export default function FeaturedPrograms() {
  const [programs, setPrograms] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setErrorMessage('')

    getPrograms({ featured: 'true' })
      .then((res) => {
        if (ignore) return
        setPrograms((res.data?.data || []).slice(0, 4))
        setStatus('success')
      })
      .catch((err) => {
        if (ignore) return
        setErrorMessage(err?.response?.data?.message || 'تعذر تحميل البرامج المميزة، برجاء المحاولة مرة أخرى.')
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
          eyebrow="برامجنا"
          title="برامج مميزة"
          description="مجموعة مختارة من برامجنا التدريبية عبر المجالات الأربعة."
        />

        {status === 'loading' && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-16">
            <p className="text-[var(--color-danger)] font-bold mb-2">تعذر تحميل البرامج المميزة</p>
            <p className="text-muted text-sm">{errorMessage}</p>
          </div>
        )}

        {status === 'success' && programs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {programs.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        )}

        {status === 'success' && programs.length === 0 && (
          <p className="text-center text-muted py-16">لا توجد برامج مميزة متاحة حاليًا.</p>
        )}

        <div className="flex justify-center">
          <Button to="/programs" variant="outline" size="md">
            عرض جميع البرامج
          </Button>
        </div>
      </div>
    </section>
  )
}