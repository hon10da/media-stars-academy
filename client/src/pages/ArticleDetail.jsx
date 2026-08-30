import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaNewspaper } from 'react-icons/fa'
import PageHero from '@/components/sections/PageHero'
import Button from '@/components/ui/Button'
import { SITE } from '@/lib/constants'
import { getMediaPostBySlug } from '@/api/media.api'

export default function ArticleDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading') // loading | success | notFound | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setErrorMessage('')
    setPost(null)

    getMediaPostBySlug(slug)
      .then((res) => {
        if (ignore) return
        const data = res.data?.data
        if (!data) {
          setStatus('notFound')
        } else {
          setPost(data)
          setStatus('success')
        }
      })
      .catch((err) => {
        if (ignore) return
        if (err?.response?.status === 404) {
          setStatus('notFound')
        } else {
          setErrorMessage(err?.response?.data?.message || 'تعذر تحميل المقال، برجاء المحاولة مرة أخرى.')
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
        <h1 className="font-display text-2xl font-bold text-navy mb-4">المقال غير موجود</h1>
        <Button to="/media" variant="outline">العودة إلى الإعلام والأخبار</Button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-4">تعذر تحميل المقال</h1>
        <p className="text-muted text-sm mb-6">{errorMessage}</p>
        <Button to="/media" variant="outline">العودة إلى الإعلام والأخبار</Button>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | {SITE.name}</title>
      </Helmet>

      <PageHero title={post.title} />

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-10">
            <div className="h-48 bg-navy/5 rounded-xl flex items-center justify-center mb-8">
              {post.coverImageUrl ? (
                <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <FaNewspaper className="text-navy/20" size={40} />
              )}
            </div>
            <p className="text-muted leading-relaxed mb-6">{post.excerpt}</p>

            {post.isPlaceholder && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                هذا محتوى تجريبي، وسيتم استبداله بالمحتوى الإعلامي الفعلي عبر لوحة التحكم.
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link to="/media" className="text-sm font-bold text-navy hover:text-[var(--color-gold)] transition-colors">
              ← العودة إلى جميع الأخبار
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}