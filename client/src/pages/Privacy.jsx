import { Helmet } from 'react-helmet-async'
import PageHero from '@/components/sections/PageHero'
import { SITE } from '@/lib/constants'

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>سياسة الخصوصية | {SITE.name}</title>
      </Helmet>

      <PageHero title="سياسة الخصوصية" />

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-10 leading-relaxed text-muted flex flex-col gap-5">
            <p>
              هذه صفحة تجريبية لسياسة الخصوصية الخاصة بأكاديمية ميديا ستارز. سيتم تحديث هذا المحتوى بسياسة
              الخصوصية الفعلية للأكاديمية قبل إطلاق الموقع رسميًا.
            </p>
            <p>
              نلتزم بالحفاظ على خصوصية بيانات زوار الموقع والمتدربين، ولا تتم مشاركة أي بيانات شخصية مع
              أطراف خارجية دون موافقة صريحة، إلا فيما يخص التزامات قانونية أو تشغيلية أساسية لتقديم خدماتنا.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
