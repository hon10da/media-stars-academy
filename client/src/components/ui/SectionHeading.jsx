import { motion } from 'framer-motion'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  className = '',
}) {
  const alignClass = align === 'right' ? 'items-start text-right' : align === 'left' ? 'items-end text-left' : 'items-center text-center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`flex flex-col ${alignClass} gap-3 mb-10 md:mb-14 ${className}`}
    >
      {eyebrow && (
        <span
          className={`text-sm font-bold tracking-widest uppercase gold-gradient-text`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${
          light ? 'text-white' : 'text-navy'
        }`}
      >
        {title}
      </h2>
      <span className="divider-gold" />
      {description && (
        <p className={`max-w-2xl text-base md:text-lg ${light ? 'text-white/80' : 'text-muted'} leading-relaxed`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
