import { Helmet } from 'react-helmet-async'
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa'
import PageHero from '@/components/sections/PageHero'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ContactForm from '@/components/forms/ContactForm'
import { SITE, WHATSAPP_LINK } from '@/lib/constants'

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>تواصل معنا | {SITE.name}</title>
      </Helmet>

      <PageHero
        title="تواصل معنا"
        description="نسعد بتواصلك معنا للاستفسار عن برامجنا أو أي استفسار آخر."
      />

      <section className="py-16 md:py-24 bg-offwhite">
        <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <Card className="lg:col-span-3 p-6 md:p-8">
            <h3 className="font-display font-bold text-navy text-xl mb-6">أرسل رسالة</h3>
            <ContactForm />
          </Card>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="p-6 md:p-8 bg-navy text-white flex flex-col gap-4" hover={false}>
              <FaWhatsapp className="text-[#25D366]" size={32} />
              <h3 className="font-display font-bold text-lg">واتساب</h3>
              <p className="text-white/70 text-sm leading-relaxed">تواصل معنا مباشرة عبر واتساب.</p>
              <Button href={WHATSAPP_LINK()} variant="primary" size="md">فتح واتساب</Button>
            </Card>

            <Card className="p-6 md:p-8 flex flex-col gap-3">
              <FaPhone className="text-[var(--color-gold)]" size={26} />
              <h3 className="font-display font-bold text-navy text-lg">الهاتف</h3>
              <a href={`tel:${SITE.phone}`} className="font-display font-bold text-navy text-lg" dir="ltr">
                {SITE.phone}
              </a>
            </Card>

            <Card className="p-6 md:p-8 flex flex-col gap-3">
              <FaEnvelope className="text-[var(--color-gold)]" size={26} />
              <h3 className="font-display font-bold text-navy text-lg">البريد الإلكتروني</h3>
              <a href={`mailto:${SITE.email}`} className="font-bold text-navy text-sm" dir="ltr">
                {SITE.email}
              </a>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
