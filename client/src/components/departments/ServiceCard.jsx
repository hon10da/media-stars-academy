import { Link } from 'react-router-dom'
import { FaTag } from 'react-icons/fa'
import { AnimatedCard } from '@/components/ui/Card'

export default function ServiceCard({ service, delay = 0 }) {
  return (
    <AnimatedCard delay={delay} className="p-6 flex flex-col gap-3">
      <FaTag className="text-[var(--color-gold)]" size={18} />
      <h3 className="font-display font-bold text-navy text-base">{service.name}</h3>
      {service.description && (
        <p className="text-muted text-sm leading-relaxed line-clamp-2">{service.description}</p>
      )}
      <Link
        to={`/services/${service.slug}`}
        className="text-sm font-bold text-[var(--color-gold)] hover:text-navy transition-colors self-start mt-1"
      >
        التفاصيل ←
      </Link>
    </AnimatedCard>
  )
}
