import { motion } from 'framer-motion'
import logo from '@/assets/images/logo.png'

export default function AboutIntro() {
  return (
    <section className="py-20 md:py-28 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="order-2 lg:order-1"
        >
          <span className="text-sm font-bold tracking-widest uppercase gold-gradient-text">من نحن</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mt-3 mb-6 leading-tight">
            نصنع نجوم الإعلام، ونبني أجيالاً واعية
          </h2>
          <p className="text-muted text-base md:text-lg leading-relaxed mb-4">
            أكاديمية ميديا ستارز مؤسسة تدريبية متخصصة تجمع بين الإعلام، الصحة النفسية، الإرشاد الأسري،
            والتعليم والتطوير في منظومة واحدة متكاملة، إيمانًا منا بأن بناء الجيل الواعي يبدأ من تأهيل
            الإنسان في هذه المجالات الأربعة معًا.
          </p>
          <p className="text-muted text-base md:text-lg leading-relaxed">
            نقدّم برامج تدريبية احترافية يشرف عليها مختصون، بأسلوب عملي يجمع بين المعرفة النظرية والتطبيق
            الفعلي، لنُخرّج كوادر قادرة على الإبداع والتأثير الإيجابي في مجتمعها.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="order-1 lg:order-2 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-[var(--color-gold)]/10 blur-2xl" />
            <img src={logo} alt="أكاديمية ميديا ستارز" className="relative w-64 md:w-80 h-auto object-contain" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
