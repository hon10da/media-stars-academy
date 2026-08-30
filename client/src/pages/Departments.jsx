import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import PageHero from '@/components/sections/PageHero'
import DepartmentCard from '@/components/departments/DepartmentCard'
import { SITE } from '@/lib/constants'
import { getDepartments } from '@/api/departments.api'

export default function Departments() {
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
    <>
      <Helmet>
        <title>الأقسام | {SITE.name}</title>
      </Helmet>

      <PageHero
        title="الأقسام"
        description="استكشف أقسام الأكاديمية والخدمات التدريبية المتخصصة تحت كل قسم."
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
              <p className="text-[var(--color-danger)] font-bold mb-2">تعذر تحميل الأقسام</p>
              <p className="text-muted text-sm">{errorMessage}</p>
            </div>
          )}

          {status === 'success' && departments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((department, idx) => (
                <DepartmentCard key={department.slug} department={department} delay={idx * 0.08} />
              ))}
            </div>
          )}

          {status === 'success' && departments.length === 0 && (
            <p className="text-center text-muted py-16">لا توجد أقسام متاحة حاليًا.</p>
          )}
        </div>
      </section>
    </>
  )
}
