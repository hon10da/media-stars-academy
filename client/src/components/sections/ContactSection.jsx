import { FaWhatsapp, FaPhone } from 'react-icons/fa'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'
import RegistrationForm from '@/components/forms/RegistrationForm'
import Button from '@/components/ui/Button'
import { SITE, WHATSAPP_LINK } from '@/lib/constants'

export default function ContactSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="التسجيل والتواصل"
          title="سجّل الآن وابدأ رحلتك"
          description="اختر الطريقة الأنسب لك للتواصل معنا والاستفسار عن برامجنا."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 p-6 md:p-8">
            <h3 className="font-display font-bold text-navy text-xl mb-6">نموذج التسجيل</h3>
            <RegistrationForm />
          </Card>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="p-6 md:p-8 bg-navy text-white flex flex-col gap-4" hover={false}>
              <FaWhatsapp className="text-[#25D366]" size={32} />
              <h3 className="font-display font-bold text-lg">تواصل مباشر عبر واتساب</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                للاستفسار السريع، تواصل معنا مباشرة عبر واتساب وسنرد عليك في أقرب وقت.
              </p>
              <Button href={WHATSAPP_LINK()} variant="primary" size="md">
                فتح واتساب
              </Button>
            </Card>

            <Card className="p-6 md:p-8 flex flex-col gap-4">
              <FaPhone className="text-[var(--color-gold)]" size={28} />
              <h3 className="font-display font-bold text-navy text-lg">اتصل بنا</h3>
              <p className="text-muted text-sm leading-relaxed">يمكنك الاتصال بنا مباشرة على الرقم التالي:</p>
              <a href={`tel:${SITE.phone}`} className="font-display font-bold text-navy text-xl" dir="ltr">
                {SITE.phone}
              </a>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
