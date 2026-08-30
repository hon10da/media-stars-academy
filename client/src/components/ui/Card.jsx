import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = true, as: Component = 'div', ...props }) {
  return (
    <Component
      className={`bg-white rounded-[var(--radius-card)] shadow-soft border border-navy/5 ${
        hover ? 'transition-all duration-300 hover:shadow-lift hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export function AnimatedCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={`bg-white rounded-[var(--radius-card)] shadow-soft border border-navy/5 transition-all duration-300 hover:shadow-lift hover:-translate-y-1 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
