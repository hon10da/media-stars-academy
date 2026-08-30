import { Link } from 'react-router-dom'
import { FaLayerGroup } from 'react-icons/fa'
import { AnimatedCard } from '@/components/ui/Card'

export default function DepartmentCard({ department, delay = 0 }) {
  return (
    <AnimatedCard delay={delay} className="p-6 flex flex-col gap-4">
      <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center">
        <FaLayerGroup className="text-[var(--color-gold-light)]" size={20} />
      </div>
      <div className="flex-1">
        <h3 className="font-display text-lg font-bold text-navy mb-2">{department.name}</h3>
        {department.description && (
          <p className="text-muted text-sm leading-relaxed">{department.description}</p>
        )}
      </div>
      <Link
        to={`/departments/${department.slug}`}
        className="text-sm font-bold text-[var(--color-gold)] hover:text-navy transition-colors self-start"
      >
        عرض القسم ←
      </Link>
    </AnimatedCard>
  )
}
