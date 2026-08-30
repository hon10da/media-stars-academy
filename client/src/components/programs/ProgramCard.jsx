import { Link } from 'react-router-dom'
import { AnimatedCard } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { DEPARTMENT_ICON_MAP, DEFAULT_DEPARTMENT_ICON } from '@/lib/constants'
import { PILLAR_ICON_MAP } from '@/components/ui/PillarIcons'

// `department` is the resolved Department object ({ _id, name, slug, ... }) for
// program.departmentRef, resolved by the parent page — this component does not
// fetch its own data, matching the project's existing presentational-card pattern.
export default function ProgramCard({ program, department = null, delay = 0 }) {
  const iconKey = department ? DEPARTMENT_ICON_MAP[department.slug] || DEFAULT_DEPARTMENT_ICON : null
  const Icon = iconKey ? PILLAR_ICON_MAP[iconKey] : null

  return (
    <AnimatedCard delay={delay} className="p-6 flex flex-col gap-4">
      <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center">
        {Icon && <Icon className="w-6 h-6" variant="light" />}
      </div>
      <div className="flex-1">
        {department && <Badge tone="gold" className="mb-3">{department.name}</Badge>}
        <h3 className="font-display text-lg font-bold text-navy mb-2">{program.title}</h3>
        <p className="text-muted text-sm leading-relaxed">{program.shortDescription}</p>
      </div>
      <Link
        to={`/programs/${program.slug}`}
        className="text-sm font-bold text-[var(--color-gold)] hover:text-navy transition-colors self-start"
      >
        عرض التفاصيل ←
      </Link>
    </AnimatedCard>
  )
}
