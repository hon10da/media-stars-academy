export default function Badge({ children, tone = 'gold', className = '' }) {
  const tones = {
    gold: 'bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30',
    navy: 'bg-navy/5 text-navy border border-navy/10',
    white: 'bg-white/10 text-white border border-white/20',
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${tones[tone]} ${className}`}>
      {children}
    </span>
  )
}

// Admin-only visual flag for seed/placeholder content — never rendered on the public site.
export function PlaceholderBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 ${className}`}
    >
      محتوى تجريبي — يرجى الاستبدال
    </span>
  )
}
