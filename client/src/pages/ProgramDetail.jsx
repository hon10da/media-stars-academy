import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaClock, FaSignal } from 'react-icons/fa'
import PageHero from '@/components/sections/PageHero'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { SITE, DEPARTMENT_ICON_MAP, DEFAULT_DEPARTMENT_ICON } from '@/lib/constants'
import { PILLAR_ICON_MAP } from '@/components/ui/PillarIcons'
import { getProgramBySlug } from '@/api/programs.api'
import { getDepartments } from '@/api/departments.api'

export default function ProgramDetail() {
  const { slug } = useParams()
  const [program, setProgram] = useState(null)
  const [status, setStatus] = useState('loading') // loading | success | notFound | error
  const [errorMessage, setErrorMessage] = useState('')

  // Full department list, used only to resolve program.departmentRef to a
  // real name/icon for display — the public Programs endpoint does not
  // populate this relation, so it's resolved client-side instead of
  // requiring a backend change.
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setErrorMessage('')
    setProgram(null)

    getProgramBySlug(slug)
      .then((res) => {
        if (ignore) return
        const data = res.data?.data
        if (!data) {
          setStatus('notFound')
        } else {
          setProgram(data)
          setStatus('success')
        }
      })
      .catch((err) => {
        if (ignore) return
        if (err?.response?.status === 404) {
          setStatus('notFound')
        } else {
          setErrorMessage(err?.response?.data?.message || 'تعذر تحميل بيانات البرنامج، برجاء المحاولة مرة أخرى.')
          setStatus('error')
        }
      })

    return () => {
      ignore = true
    }
  }, [slug])

  useEffect(() => {
    let ignore = false

    getDepartments()
      .then((res) => {
        if (ignore) return
        setDepartments(res.data?.data || [])
      })
      .catch(() => {
        // Non-critical: the page still works without the department badge/icon.
      })

    return () => {
      ignore = true
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'notFound') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-4">البرنامج غير موجود</h1>
        <Button to="/programs" variant="outline">العودة إلى البرامج</Button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-4">تعذر تحميل البرنامج</h1>
        <p className="text-muted text-sm mb-6">{errorMessage}</p>
        <Button to="/programs" variant="outline">العودة إلى البرامج</Button>
      </div>
    )
  }

  const department = departments.find((d) => d._id === program.departmentRef) || null
  const iconKey = department ? DEPARTMENT_ICON_MAP[department.slug] || DEFAULT_DEPARTMENT_ICON : null
  const Icon = iconKey ? PILLAR_ICON_MAP[iconKey] : null

  return (
    <>
      <Helmet>
        <title>{program.title} | {SITE.name}</title>
      </Helmet>

      <PageHero title={program.title} description={department?.name} />

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center shrink-0">
              {Icon && <Icon className="w-7 h-7" variant="light" />}
            </div>
            {department && <Badge tone="gold">{department.name}</Badge>}
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-10">
            <p className="text-muted text-base leading-relaxed mb-8">{program.shortDescription}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <FaClock className="text-[var(--color-gold)]" />
                <div>
                  <p className="text-xs text-muted">المدة</p>
                  <p className="font-bold text-navy text-sm">{program.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaSignal className="text-[var(--color-gold)]" />
                <div>
                  <p className="text-xs text-muted">المستوى</p>
                  <p className="font-bold text-navy text-sm">{program.level}</p>
                </div>
              </div>
            </div>

            {program.isPlaceholder && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-8">
                محتوى هذا البرنامج تجريبي مبدئي، وسيتم استبداله بتفاصيل المنهج الفعلية قريبًا.
              </div>
            )}

            <Button to="/contact" variant="primary" size="lg">سجل في هذا البرنامج</Button>
          </div>

          <div className="mt-8 text-center">
            <Link to="/programs" className="text-sm font-bold text-navy hover:text-[var(--color-gold)] transition-colors">
              ← العودة إلى جميع البرامج
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
