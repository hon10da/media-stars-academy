import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import PageHero from '@/components/sections/PageHero'
import SectionHeading from '@/components/ui/SectionHeading'
import { AnimatedCard } from '@/components/ui/Card'
import FourPillars from '@/components/sections/FourPillars'
import { SITE } from '@/lib/constants'

const VALUES = [
  { title: 'الاحترافية', description: 'نلتزم بأعلى معايير الجودة في تصميم وتقديم برامجنا التدريبية.' },
  { title: 'الإنسانية', description: 'نضع الإنسان في قلب كل برنامج نقدمه، إعلاميًا كان أو نفسيًا أو أسريًا.' },
  { title: 'المصداقية', description: 'نلتزم بالشفافية في كل ما نقدمه من محتوى ومعلومات.' },
  { title: 'التطوير المستمر', description: 'نحرص على تطوير برامجنا باستمرار لمواكبة احتياجات المتدربين.' },
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>من نحن | {SITE.name}</title>
      </Helmet>

      <PageHero
        title="من نحن"
        description="تعرف على رسالة ورؤية أكاديمية ميديا ستارز ومنظومتها التدريبية المتكاملة."
      />

      <section className="py-20 md:py-28 bg-offwhite">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl text-navy font-bold leading-relaxed mb-6"
          >
            {SITE.tagline}
          </motion.p>
          <p className="text-muted text-base md:text-lg leading-relaxed">
            أكاديمية ميديا ستارز مؤسسة تدريبية متخصصة تجمع بين الإعلام، الصحة النفسية، الإرشاد الأسري،
            والتعليم والتطوير، بهدف تأهيل كوادر واعية وقادرة على الإبداع والتأثير الإيجابي في المجتمع.
            نؤمن بأن التدريب الحقيقي هو الذي يجمع بين المعرفة والتطبيق، وبين المهارة والوعي الإنساني.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedCard className="p-8">
            <h3 className="font-display text-xl font-bold text-navy mb-3">رسالتنا</h3>
            <p className="text-muted leading-relaxed">
              تقديم برامج تدريبية احترافية تجمع بين الإعلام والصحة النفسية والإرشاد الأسري والتعليم،
              لبناء أجيال واعية وقادرة على التأثير الإيجابي.
            </p>
          </AnimatedCard>
          <AnimatedCard delay={0.1} className="p-8">
            <h3 className="font-display text-xl font-bold text-navy mb-3">رؤيتنا</h3>
            <p className="text-muted leading-relaxed">
              أن نكون منظومة تدريبية رائدة في دمج الإعلام والوعي الإنساني، ومرجعًا موثوقًا في مجالاتنا الأربعة.
            </p>
          </AnimatedCard>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <SectionHeading eyebrow="قيمنا" title="القيم التي نؤمن بها" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, idx) => (
              <AnimatedCard key={v.title} delay={idx * 0.1} className="p-6 text-center">
                <h4 className="font-display font-bold text-navy mb-2">{v.title}</h4>
                <p className="text-muted text-sm leading-relaxed">{v.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <FourPillars />
    </>
  )
}
