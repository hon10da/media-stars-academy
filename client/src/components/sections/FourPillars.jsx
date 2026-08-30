import { useState, useEffect } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import { AnimatedCard } from '@/components/ui/Card'
import { DEPARTMENT_ICON_MAP, DEFAULT_DEPARTMENT_ICON } from '@/lib/constants'
import { PILLAR_ICON_MAP } from '@/components/ui/PillarIcons'
import { getDepartments } from '@/api/departments.api'

export default function FourPillars() {
  const [departments, setDepartments] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setErrorMessage('')

    getDepartments()
      .then((res) => {
        if (ignore) return
        setDepartments(res.data?.data || [])
        setStatus('success')
      })
      .catch((err) => {
        if (ignore) return
        setErrorMessage(err?.response?.data?.message || 'تعذر تحميل الأقسام، برجاء المحاولة مرة أخرى.')
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
          eyebrow="مجالاتنا"
          title="منظومة متكاملة لبناء الإنسان الواعي"
          description="أقسام أساسية تعمل معًا لتأهيل شخصية متزنة ومؤثرة، إعلاميًا ونفسيًا وتنمويًا."
        />

        {status === 'loading' && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-16">
            <p className="text-[var(--color-danger)] font-bold mb-2">تعذر تحميل الأقسام</p>
            <p className="text-muted text-sm">{errorMessage}</p>
          </div>
        )}

        {status === 'success' && departments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((department, idx) => {
              const iconKey = DEPARTMENT_ICON_MAP[department.slug] || DEFAULT_DEPARTMENT_ICON
              const Icon = PILLAR_ICON_MAP[iconKey]
              return (
                <AnimatedCard
                  key={department.slug}
                  delay={idx * 0.1}
                  className="p-8 flex flex-col items-center text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center">
                    {Icon && <Icon className="w-8 h-8" variant="light" />}
                  </div>
                  <h3 className="font-display text-xl font-bold text-navy">{department.name}</h3>
                  {department.description && (
                    <p className="text-muted text-sm leading-relaxed">{department.description}</p>
                  )}
                </AnimatedCard>
              )
            })}
          </div>
        )}

        {status === 'success' && departments.length === 0 && (
          <p className="text-center text-muted py-16">لا توجد أقسام متاحة حاليًا.</p>
        )}
      </div>
    </section>
  )
}
