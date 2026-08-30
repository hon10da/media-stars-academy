// Custom line-icon set drawn to match the Media Stars Academy logo style:
// thin gold stroke by default, with a `variant="light"` option for use on dark navy backgrounds.
// These intentionally mirror the exact motifs used in the official logo
// (microphone / heart-brain / family / open book) rather than generic library icons.

const strokeColor = (variant) => (variant === 'light' ? '#FAF9F6' : 'url(#msaGoldStroke)')

function GoldDefs() {
  return (
    <defs>
      <linearGradient id="msaGoldStroke" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C9A24B" />
        <stop offset="50%" stopColor="#E8C874" />
        <stop offset="100%" stopColor="#C9A24B" />
      </linearGradient>
    </defs>
  )
}

export function MicrophoneIcon({ className = 'w-8 h-8', variant = 'gold' }) {
  const stroke = strokeColor(variant)
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <GoldDefs />
      <rect x="18" y="6" width="12" height="20" rx="6" stroke={stroke} strokeWidth="2" />
      <line x1="21.5" y1="11" x2="26.5" y2="11" stroke={stroke} strokeWidth="1.5" />
      <line x1="21.5" y1="15" x2="26.5" y2="15" stroke={stroke} strokeWidth="1.5" />
      <line x1="21.5" y1="19" x2="26.5" y2="19" stroke={stroke} strokeWidth="1.5" />
      <path d="M11 21C11 28.2 16.8 34 24 34C31.2 34 37 28.2 37 21" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="34" x2="24" y2="41" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="41" x2="32" y2="41" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function BrainHeartIcon({ className = 'w-8 h-8', variant = 'gold' }) {
  const stroke = strokeColor(variant)
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <GoldDefs />
      <path
        d="M24 10C19 6 11 9 11 17c0 6 4.5 9 8 12.5C22 32.5 24 36 24 38c0-2 2-5.5 5-8.5 3.5-3.5 8-6.5 8-12.5 0-8-8-11-13-7z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M24 15c-1.5 2-4 2-4 5s2.5 4 4 6c1.5-2 4-3 4-6s-2.5-3-4-5z" stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}

export function FamilyIcon({ className = 'w-8 h-8', variant = 'gold' }) {
  const stroke = strokeColor(variant)
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <GoldDefs />
      <circle cx="15" cy="12" r="4" stroke={stroke} strokeWidth="2" />
      <circle cx="33" cy="12" r="4" stroke={stroke} strokeWidth="2" />
      <circle cx="24" cy="22" r="3.5" stroke={stroke} strokeWidth="2" />
      <path d="M8 30c0-5 3-8 7-8s7 3 7 8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M26 30c0-5 3-8 7-8s7 3 7 8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M17 40c0-5.5 3-9 7-9s7 3.5 7 9" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function BookIcon({ className = 'w-8 h-8', variant = 'gold' }) {
  const stroke = strokeColor(variant)
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <GoldDefs />
      <path d="M24 14c-3.5-3-9-4-15-2v22c6-2 11.5-1 15 2" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 14c3.5-3 9-4 15-2v22c-6-2-11.5-1-15 2" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <line x1="24" y1="14" x2="24" y2="36" stroke={stroke} strokeWidth="2" />
    </svg>
  )
}

export const PILLAR_ICON_MAP = {
  microphone: MicrophoneIcon,
  'brain-heart': BrainHeartIcon,
  family: FamilyIcon,
  book: BookIcon,
}
