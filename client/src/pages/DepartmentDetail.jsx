import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PageHero from '@/components/sections/PageHero'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/ui/SectionHeading'
import ServiceCard from '@/components/departments/ServiceCard'
import ProgramCard from '@/components/programs/ProgramCard'
import TrainerCard from '@/components/trainers/TrainerCard'
import { SITE } from '@/lib/constants'
import { getDepartmentBySlug, getServicesByDepartmentSlug } from '@/api/departments.api'
import { getPrograms } from '@/api/programs.api'
import { getTrainers } from '@/api/trainers.api'

// Small inline spinner reused across the sub-sections of this page.
function InlineSpinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
    </div>
  )
}

export default function DepartmentDetail() {
  const { slug } = useParams()

  const [department, setDepartment] = useState(null)
  const [pageStatus, setPageStatus] = useState('loading') // loading | success | notFound | error
  const [pageErrorMessage, setPageErrorMessage] = useState('')

  const [services, setServices] = useState([])
  const [servicesStatus, setServicesStatus] = useState('loading') // loading | success | error

  const [relatedPrograms, setRelatedPrograms] = useState([])
  const [programsStatus, setProgramsStatus] = useState('loading') // loading | success | error

  const [relatedTrainers, setRelatedTrainers] = useState([])
  const [trainersStatus, setTrainersStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    let ignore = false
    setPageStatus('loading')
    setPageErrorMessage('')
    setDepartment(null)

    getDepartmentBySlug(slug)
      .then((res) => {
        if (ignore) return
        const data = res.data?.data
        if (!data) {
          setPageStatus('notFound')
        } else {
          setDepartment(data)
          setPageStatus('success')
        }
      })
      .catch((err) => {
        if (ignore) return
        if (err?.response?.status === 404) {
          setPageStatus('notFound')
        } else {
          setPageErrorMessage(err?.response?.data?.message || 'تعذر تحميل بيانات القسم، برجاء المحاولة مرة أخرى.')
          setPageStatus('error')
        }
      })

    return () => {
      ignore = true
    }
  }, [slug])

  // Once the department is loaded, fetch its services, and — using the
  // already-existing Program/Trainer public APIs — resolve which published
  // programs/trainers belong to this department via their departmentRef(s).
  // No backend change was needed for this: the existing endpoints already
  // return departmentRef/departmentRefs on each item, so filtering happens
  // client-side rather than inventing a new backend query parameter.
  useEffect(() => {
    if (!department) return
    let ignore = false

    setServicesStatus('loading')
    getServicesByDepartmentSlug(slug)
      .then((res) => {
        if (ignore) return
        setServices(res.data?.data || [])
        setServicesStatus('success')
      })
      .catch(() => {
        if (ignore) return
        setServicesStatus('error')
      })

    setProgramsStatus('loading')
    getPrograms()
      .then((res) => {
        if (ignore) return
        const all = res.data?.data || []
        const filtered = all.filter((p) => p.departmentRef === department._id)
        setRelatedPrograms(filtered)
        setProgramsStatus('success')
      })
      .catch(() => {
        if (ignore) return
        setProgramsStatus('error')
      })

    setTrainersStatus('loading')
    getTrainers()
      .then((res) => {
        if (ignore) return
        const all = res.data?.data || []
        const filtered = all.filter((t) => Array.isArray(t.departmentRefs) && t.departmentRefs.includes(department._id))
        setRelatedTrainers(filtered)
        setTrainersStatus('success')
      })
      .catch(() => {
        if (ignore) return
        setTrainersStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [department, slug])

  if (pageStatus === 'loading') {
    return (
      <div className="flex justify-center py-32">
        <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
      </div>
    )
  }

  if (pageStatus === 'notFound') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-4">القسم غير موجود</h1>
        <Button to="/departments" variant="outline">العودة إلى الأقسام</Button>
      </div>
    )
  }

  if (pageStatus === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-4">تعذر تحميل القسم</h1>
        <p className="text-muted text-sm mb-6">{pageErrorMessage}</p>
        <Button to="/departments" variant="outline">العودة إلى الأقسام</Button>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{department.name} | {SITE.name}</title>
      </Helmet>

      <PageHero title={department.name} description={department.description} />

      {/* Services under this department */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="خدمات القسم" title="الخدمات المتاحة" align="right" />

          {servicesStatus === 'loading' && <InlineSpinner />}
          {servicesStatus === 'error' && (
            <p className="text-center text-[var(--color-danger)] text-sm py-6">تعذر تحميل خدمات هذا القسم.</p>
          )}
          {servicesStatus === 'success' && services.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <ServiceCard key={service.slug} service={service} delay={idx * 0.08} />
              ))}
            </div>
          )}
          {servicesStatus === 'success' && services.length === 0 && (
            <p className="text-center text-muted py-10">لا توجد خدمات منشورة تحت هذا القسم حاليًا.</p>
          )}
        </div>
      </section>

      {/* Programs related to this department */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="برامج القسم" title="البرامج المرتبطة" align="right" />

          {programsStatus === 'loading' && <InlineSpinner />}
          {programsStatus === 'error' && (
            <p className="text-center text-[var(--color-danger)] text-sm py-6">تعذر تحميل برامج هذا القسم.</p>
          )}
          {programsStatus === 'success' && relatedPrograms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPrograms.map((program, idx) => (
                <ProgramCard key={program.slug} program={program} delay={idx * 0.08} />
              ))}
            </div>
          )}
          {programsStatus === 'success' && relatedPrograms.length === 0 && (
            <p className="text-center text-muted py-10">لا توجد برامج مرتبطة بهذا القسم حاليًا.</p>
          )}
        </div>
      </section>

      {/* Trainers related to this department */}
      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="مدربو القسم" title="المدربون المتخصصون" align="right" />

          {trainersStatus === 'loading' && <InlineSpinner />}
          {trainersStatus === 'error' && (
            <p className="text-center text-[var(--color-danger)] text-sm py-6">تعذر تحميل مدربي هذا القسم.</p>
          )}
          {trainersStatus === 'success' && relatedTrainers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTrainers.map((trainer, idx) => (
                <TrainerCard key={trainer.slug} trainer={trainer} delay={idx * 0.08} />
              ))}
            </div>
          )}
          {trainersStatus === 'success' && relatedTrainers.length === 0 && (
            <p className="text-center text-muted py-10">لا يوجد مدربون مرتبطون بهذا القسم حاليًا.</p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 text-center">
        <Link to="/departments" className="text-sm font-bold text-navy hover:text-[var(--color-gold)] transition-colors">
          ← العودة إلى جميع الأقسام
        </Link>
      </div>
    </>
  )
}
