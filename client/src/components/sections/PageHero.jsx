import { motion } from 'framer-motion'

export default function PageHero({ title, description }) {
  return (
    <section className="bg-navy py-20 md:py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: 'radial-gradient(circle at 80% 20%, rgba(201,162,75,0.15), transparent 45%)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-4"
      >
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white">{title}</h1>
        <span className="divider-gold" />
        {description && <p className="text-white/70 text-base md:text-lg max-w-xl">{description}</p>}
      </motion.div>
    </section>
  )
}
