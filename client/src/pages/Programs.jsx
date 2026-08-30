import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import PageHero from '@/components/sections/PageHero'
import ProgramFilterBar from '@/components/programs/ProgramFilterBar'
import ProgramCard from '@/components/programs/ProgramCard'
import { SITE } from '@/lib/constants'
import { getPrograms } from '@/api/programs.api'
import { getDepartments } from '@/api/departments.api'

export default function Programs() {
  const [active, setActive] = useState('all') // 'all' or a Department _id

  const [departments, setDepartments] = useState([])
  const [departmentsStatus, setDepartmentsStatus] = useState('loading') // loading | success | error

  const [programs, setPrograms] = useState([])
  const [programsStatus, setProgramsStatus] = useState('loading') // loading | success | error
  const [programsErrorMessage, setProgramsErrorMessage] = useState('')

  // Departments power the filter bar's options.
  useEffect(() => {
    let ignore = false
    setDepartmentsStatus('loading')

    getDepartments()
      .then((res) => {
        if (ignore) return
        setDepartments(res.data?.data || [])
        setDepartmentsStatus('success')
      })
      .catch(() => {
        if (ignore) return
        setDepartmentsStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [])

  // Programs are fetched once, unfiltered — the public /api/programs endpoint
  // does not currently support filtering by departmentRef (only the legacy
  // `pillar` field is in its filterableFields), so filtering by department
  // happens entirely client-side below, without any backend change.
  useEffect(() => {
    let ignore = false
    setProgramsStatus('loading')
    setProgramsErrorMessage('')

    getPrograms()
      .then((res) => {
        if (ignore) return
        setPrograms(res.data?.data || [])
        setProgramsStatus('success')
      })
      .catch((err) => {
        if (ignore) return
        setProgramsErrorMessage(err?.response?.data?.message || 'تعذر تحميل البرامج، برجاء المحاولة مرة أخرى.')
        setProgramsStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [])

  const departmentById = useMemo(() => {
    const map = {}
    departments.forEach((d) => {
      map[d._id] = d
    })
    return map
  }, [departments])

  const filteredPrograms = useMemo(() => {
    if (active === 'all') return programs
    return programs.filter((p) => p.departmentRef === active)
  }, [programs, active])

  return (
    <>
      <Helmet>
        <title>البرامج والدورات | {SITE.name}</title>
      </Helmet>

      <PageHero
        title="البرامج والدورات"
        description="استكشف برامجنا التدريبية عبر أقسام الأكاديمية المتخصصة."
      />

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ProgramFilterBar active={active} onChange={setActive} departments={departments} />

          {departmentsStatus === 'error' && (
            <p className="text-center text-muted text-xs mb-6">تعذر تحميل قائمة الأقسام للتصفية.</p>
          )}

          {programsStatus === 'loading' && (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
            </div>
          )}

          {programsStatus === 'error' && (
            <div className="text-center py-16">
              <p className="text-[var(--color-danger)] font-bold mb-2">تعذر تحميل البرامج</p>
              <p className="text-muted text-sm">{programsErrorMessage}</p>
            </div>
          )}

          {programsStatus === 'success' && filteredPrograms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program, idx) => (
                <ProgramCard
                  key={program.slug}
                  program={program}
                  department={departmentById[program.departmentRef] || null}
                  delay={idx * 0.08}
                />
              ))}
            </div>
          )}

          {programsStatus === 'success' && filteredPrograms.length === 0 && (
            <p className="text-center text-muted py-16">لا توجد برامج متاحة حاليًا في هذا التصنيف.</p>
          )}
        </div>
      </section>
    </>
  )
}
