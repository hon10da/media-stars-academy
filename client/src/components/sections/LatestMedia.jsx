import { useState, useEffect } from 'react'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import ArticleCard from '@/components/media/ArticleCard'
import { getMediaPosts } from '@/api/media.api'

export default function LatestMedia() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let ignore = false
    setStatus('loading')
    setErrorMessage('')

    getMediaPosts()
      .then((res) => {
        if (ignore) return
        setPosts((res.data?.data || []).slice(0, 3))
        setStatus('success')
      })
      .catch((err) => {
        if (ignore) return
        setErrorMessage(err?.response?.data?.message || 'تعذر تحميل الأخبار، برجاء المحاولة مرة أخرى.')
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
          eyebrow="الإعلام والأخبار"
          title="آخر الأخبار والفعاليات"
          description="تابع آخر مستجدات الأكاديمية وأنشطتها الإعلامية."
        />

        {status === 'loading' && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-16">
            <p className="text-[var(--color-danger)] font-bold mb-2">تعذر تحميل الأخبار</p>
            <p className="text-muted text-sm">{errorMessage}</p>
          </div>
        )}

        {status === 'success' && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post, idx) => (
              <ArticleCard key={post.slug} post={post} delay={idx * 0.1} />
            ))}
          </div>
        )}

        {status === 'success' && posts.length === 0 && (
          <p className="text-center text-muted py-16">لا توجد أخبار متاحة حاليًا.</p>
        )}

        <div className="flex justify-center">
          <Button to="/media" variant="outline" size="md">
            عرض جميع الأخبار
          </Button>
        </div>
      </div>
    </section>
  )
}