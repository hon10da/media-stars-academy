import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaUser } from 'react-icons/fa'
import PageHero from '@/components/sections/PageHero'
import Button from '@/components/ui/Button'
import { SITE } from '@/lib/constants'
import { getTrainerBySlug } from '@/api/trainers.api'

export default function TrainerDetail() {
  const { slug } = useParams()
  const [trainer, setTrainer] = useState(null)
  const [status, setStatus] = useState('loading') // loading | success | notFound | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setErrorMessage('')
    setTrainer(null)

    getTrainerBySlug(slug)
      .then((res) => {
        if (ignore) return
        const data = res.data?.data
        if (!data) {
          setStatus('notFound')
        } else {
          setTrainer(data)
          setStatus('success')
        }
      })
      .catch((err) => {
        if (ignore) return
        if (err?.response?.status === 404) {
          setStatus('notFound')
        } else {
          setErrorMessage(err?.response?.data?.message || 'تعذر تحميل بيانات المدرب، برجاء المحاولة مرة أخرى.')
          setStatus('error')
        }
      })

    return () => {
      ignore = true
    }
  }, [slug])

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
        <h1 className="font-display text-2xl font-bold text-navy mb-4">المدرب غير موجود</h1>
        <Button to="/trainers" variant="outline">العودة إلى المدربين</Button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-4">تعذر تحميل بيانات المدرب</h1>
        <p className="text-muted text-sm mb-6">{errorMessage}</p>
        <Button to="/trainers" variant="outline">العودة إلى المدربين</Button>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{trainer.name} | {SITE.name}</title>
      </Helmet>

      <PageHero title={trainer.name} description={trainer.specialty} />

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-10 flex flex-col items-center text-center gap-5">
            <div className="w-28 h-28 rounded-full bg-navy/5 border-2 border-[var(--color-gold)]/30 flex items-center justify-center">
              {trainer.photoUrl ? (
                <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <FaUser className="text-navy/30" size={40} />
              )}
            </div>
            <p className="text-muted leading-relaxed">{trainer.bio}</p>

            {trainer.isPlaceholder && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 w-full">
                هذا ملف تجريبي، وسيتم استبداله ببيانات المدرب الحقيقية عبر لوحة التحكم.
              </div>
            )}

            <Button to="/contact" variant="primary" size="lg">تواصل بخصوص برامج هذا المدرب</Button>
          </div>

          <div className="mt-8 text-center">
            <Link to="/trainers" className="text-sm font-bold text-navy hover:text-[var(--color-gold)] transition-colors">
              ← العودة إلى جميع المدربين
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}