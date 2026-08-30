import { Helmet } from 'react-helmet-async'
import { FaStar } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import { SITE } from '@/lib/constants'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>الصفحة غير موجودة | {SITE.name}</title>
      </Helmet>

      <section className="min-h-[70vh] flex items-center justify-center bg-offwhite">
        <div className="text-center px-4 flex flex-col items-center gap-6">
          <FaStar className="text-[var(--color-gold)]" size={48} />
          <h1 className="font-display text-5xl md:text-6xl font-bold text-navy">404</h1>
          <p className="text-muted text-lg max-w-md">
            عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          <Button to="/" variant="primary" size="lg">
            العودة إلى الرئيسية
          </Button>
        </div>
      </section>
    </>
  )
}
