import { Link } from 'react-router-dom'
import { FaUser } from 'react-icons/fa'
import { AnimatedCard } from '@/components/ui/Card'

export default function TrainerCard({ trainer, delay = 0 }) {
  return (
    <AnimatedCard delay={delay} className="p-6 flex flex-col items-center text-center gap-3">
      <div className="w-24 h-24 rounded-full bg-navy/5 border-2 border-[var(--color-gold)]/30 flex items-center justify-center overflow-hidden">
        {trainer.photoUrl ? (
          <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover" />
        ) : (
          <FaUser className="text-navy/30" size={32} />
        )}
      </div>
      <h3 className="font-display font-bold text-navy text-lg">{trainer.name}</h3>
      <span className="text-sm text-[var(--color-gold)] font-bold">{trainer.specialty}</span>
      <p className="text-muted text-sm leading-relaxed line-clamp-2">{trainer.bio}</p>
      <Link
        to={`/trainers/${trainer.slug}`}
        className="text-sm font-bold text-navy hover:text-[var(--color-gold)] transition-colors mt-2"
      >
        عرض الملف الشخصي ←
      </Link>
    </AnimatedCard>
  )
}
