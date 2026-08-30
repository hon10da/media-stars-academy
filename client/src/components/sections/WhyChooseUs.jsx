import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'
import SectionHeading from '@/components/ui/SectionHeading'
import { WHY_CHOOSE_US } from '@/lib/placeholderData'

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-navy relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(circle at 20% 10%, rgba(201,162,75,0.12), transparent 40%)' }}
      />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeading
          eyebrow="لماذا نحن"
          title="لماذا تختار أكاديمية ميديا ستارز"
          description="نبني تجربة تدريبية متكاملة تجمع بين الاحترافية والعمق الإنساني."
          light
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {WHY_CHOOSE_US.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <span className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center shrink-0 mt-1">
                <FaCheck className="text-navy" size={14} />
              </span>
              <div>
                <h3 className="font-display font-bold text-white text-lg mb-1">{item.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
