import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 font-body font-bold rounded-[var(--radius-btn)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2'

const variants = {
  primary:
    'gold-gradient text-navy shadow-soft hover:shadow-lift hover:-translate-y-0.5',
  outline:
    'border-2 border-navy text-navy hover:bg-navy hover:text-white',
  outlineGold:
    'border-2 border-[var(--color-gold)] text-[var(--color-gold-light)] hover:bg-[var(--color-gold)] hover:text-navy',
  ghost: 'text-navy hover:bg-navy/5',
  dark: 'bg-navy text-white hover:bg-[var(--color-navy-secondary)]',
}

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
}

export default function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
