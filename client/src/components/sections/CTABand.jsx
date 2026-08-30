import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { SITE } from '@/lib/constants'

export default function CTABand() {
  return (
    <section className="bg-navy py-16 md:py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201,162,75,0.15), transparent 50%)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-6"
      >
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-relaxed">
          ابدأ رحلتك مع {SITE.name} اليوم
        </h2>
        <p className="text-white/70 text-base md:text-lg max-w-xl">
          انضم إلى برامجنا التدريبية المتخصصة وكن جزءًا من رحلة بناء الوعي والتأثير.
        </p>
        <Button to="/contact" variant="primary" size="lg">
          سجل الآن
        </Button>
      </motion.div>
    </section>
  )
}
