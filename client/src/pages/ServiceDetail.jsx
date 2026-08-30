import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaTag } from 'react-icons/fa'
import PageHero from '@/components/sections/PageHero'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import SectionHeading from '@/components/ui/SectionHeading'
import ProgramCard from '@/components/programs/ProgramCard'
import { SITE } from '@/lib/constants'
import { getServiceBySlug } from '@/api/services.api'
import { getPrograms } from '@/api/programs.api'

export default function ServiceDetail() {
  const { slug } = useParams()

  const [service, setService] = useState(null)
  const [status, setStatus] = useState('loading') // loading | success | notFound | error
  const [errorMessage, setErrorMessage] = useState('')

  const [relatedPrograms, setRelatedPrograms] = useState([])
  const [programsStatus, setProgramsStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setErrorMessage('')
    setService(null)

    getServiceBySlug(slug)
      .then((res) => {
        if (ignore) return
        const data = res.data?.data
        if (!data) {
          setStatus('notFound')
        } else {
          setService(data)
          setStatus('success')
        }
      })
      .catch((err) => {
        if (ignore) return
        if (err?.response?.status === 404) {
          setStatus('notFound')
        } else {
          setErrorMessage(err?.response?.data?.message || 'تعذر تحميل بيانات الخدمة، برجاء المحاولة مرة أخرى.')
          setStatus('error')
        }
      })

    return () => {
      ignore = true
    }
  }, [slug])

  // Same client-side resolution pattern as DepartmentDetail: the existing
  // public Programs API already returns serviceRefs on each program, so no
  // backend change or new query parameter is needed to find related programs.
  useEffect(() => {
    if (!service) return
    let ignore = false

    setProgramsStatus('loading')
    getPrograms()
      .then((res) => {
        if (ignore) return
        const all = res.data?.data || []
        const filtered = all.filter((p) => Array.isArray(p.serviceRefs) && p.serviceRefs.includes(service._id))
        setRelatedPrograms(filtered)
        setProgramsStatus('success')
      })
      .catch(() => {
        if (ignore) return
        setProgramsStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [service])

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
        <h1 className="font-display text-2xl font-bold text-navy mb-4">الخدمة غير موجودة</h1>
        <Button to="/departments" variant="outline">العودة إلى الأقسام</Button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-4">تعذر تحميل الخدمة</h1>
        <p className="text-muted text-sm mb-6">{errorMessage}</p>
        <Button to="/departments" variant="outline">العودة إلى الأقسام</Button>
      </div>
    )
  }

  const department = service.departmentRef // populated object { _id, name, slug } from the backend

  return (
    <>
      <Helmet>
        <title>{service.name} | {SITE.name}</title>
      </Helmet>

      <PageHero title={service.name} description={department?.name} />

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center shrink-0">
              <FaTag className="text-[var(--color-gold-light)]" size={22} />
            </div>
            {department && (
              <Link to={`/departments/${department.slug}`}>
                <Badge tone="gold">{department.name}</Badge>
              </Link>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-10">
            {service.description ? (
              <p className="text-muted text-base leading-relaxed mb-4">{service.description}</p>
            ) : (
              <p className="text-muted text-base leading-relaxed mb-4">لا يوجد وصف تفصيلي لهذه الخدمة حاليًا.</p>
            )}

            <Button to="/contact" variant="primary" size="lg">استفسر عن هذه الخدمة</Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="برامج ذات صلة" title="البرامج المرتبطة بهذه الخدمة" align="right" />

          {programsStatus === 'loading' && (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
            </div>
          )}
          {programsStatus === 'error' && (
            <p className="text-center text-[var(--color-danger)] text-sm py-6">تعذر تحميل البرامج المرتبطة.</p>
          )}
          {programsStatus === 'success' && relatedPrograms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPrograms.map((program, idx) => (
                <ProgramCard key={program.slug} program={program} delay={idx * 0.08} />
              ))}
            </div>
          )}
          {programsStatus === 'success' && relatedPrograms.length === 0 && (
            <p className="text-center text-muted py-10">لا توجد برامج مرتبطة بهذه الخدمة حاليًا.</p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 text-center">
        {department ? (
          <Link
            to={`/departments/${department.slug}`}
            className="text-sm font-bold text-navy hover:text-[var(--color-gold)] transition-colors"
          >
            ← العودة إلى قسم {department.name}
          </Link>
        ) : (
          <Link to="/departments" className="text-sm font-bold text-navy hover:text-[var(--color-gold)] transition-colors">
            ← العودة إلى الأقسام
          </Link>
        )}
      </div>
    </>
  )
}
