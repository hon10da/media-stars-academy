// Central place for brand-level constants.
// Editing here propagates across the whole site.

export const SITE = {
  name: 'أكاديمية ميديا ستارز',
  nameEn: 'Media Stars Academy',
  tagline: 'نصنع نجوم الإعلام... ونبني أجيالاً واعية',
  phone: '01142742918',
  whatsapp: '201142742918', // international format without + for wa.me links
  email: 'info@mediastarsacademy.com', // placeholder — replace with real address
}

export const WHATSAPP_LINK = (message = 'أرغب في الاستفسار عن برامج أكاديمية ميديا ستارز') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`

// The four core pillars — identifiers match the backend `pillar` enum exactly.
export const PILLARS = [
  {
    id: 'media',
    label: 'الإعلام',
    description: 'تدريب احترافي في مجالات الإذاعة، التقديم، والإنتاج الإعلامي.',
    icon: 'microphone',
  },
  {
    id: 'mental_health',
    label: 'الصحة النفسية',
    description: 'برامج توعوية وتأهيلية لدعم الصحة النفسية والتوازن الداخلي.',
    icon: 'brain-heart',
  },
  {
    id: 'family_counseling',
    label: 'الإرشاد الأسري',
    description: 'إرشاد أسري متخصص لتعزيز الترابط والتواصل داخل الأسرة.',
    icon: 'family',
  },
  {
    id: 'education',
    label: 'التعليم والتطوير',
    description: 'برامج تعليمية وتطويرية لبناء المهارات والقدرات الشخصية.',
    icon: 'book',
  },
]

// Phase 5B: real Departments don't currently store an icon in the database
// (Department.icon defaults to an empty string), so this bridges known real
// department slugs to the existing hand-drawn icon set in PillarIcons.jsx
// without inventing a new backend field or modifying the seed data.
// Falls back to DEFAULT_DEPARTMENT_ICON for any department slug not listed here.
export const DEPARTMENT_ICON_MAP = {
  media: 'microphone',
  'mental-health': 'brain-heart',
  'human-development': 'book',
}
export const DEFAULT_DEPARTMENT_ICON = 'book'

// Phase 5C: Program.pillar remains `required: true` on the backend for
// backward compatibility (intentionally not changed). When an admin creates/
// edits a Program through the new Department-based UI, this bridges the
// chosen Department's slug to a valid legacy pillar enum value automatically,
// so the required field is satisfied without ever exposing a pillar dropdown
// to the admin user. Not used for reading/displaying existing data — only
// for writing new/updated Program documents from the new UI.
export const DEPARTMENT_SLUG_TO_PILLAR = {
  media: 'media',
  'mental-health': 'mental_health',
  'human-development': 'education',
}

export const MAIN_NAV = [
  { to: '/', label: 'الرئيسية' },
  { to: '/about', label: 'من نحن' },
  { to: '/departments', label: 'الأقسام' },
  { to: '/programs', label: 'البرامج' },
  { to: '/trainers', label: 'المدربون' },
  { to: '/media', label: 'الإعلام والأخبار' },
  { to: '/contact', label: 'تواصل معنا' },
]

export const FOOTER_LINKS = {
  quick: MAIN_NAV,
  legal: [{ to: '/privacy', label: 'سياسة الخصوصية' }],
}

export const SOCIAL_LINKS = [
  // Placeholder — replace with real academy social profiles.
  { id: 'facebook', label: 'فيسبوك', url: '#' },
  { id: 'instagram', label: 'انستغرام', url: '#' },
  { id: 'youtube', label: 'يوتيوب', url: '#' },
  { id: 'tiktok', label: 'تيك توك', url: '#' },
]
