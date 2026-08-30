import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import Button from '@/components/ui/Button'
import { SITE, DEPARTMENT_ICON_MAP, DEFAULT_DEPARTMENT_ICON } from '@/lib/constants'
import { PILLAR_ICON_MAP } from '@/components/ui/PillarIcons'
import { getDepartments } from '@/api/departments.api'

export default function Hero() {
  const [departments, setDepartments] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    let ignore = false
    setStatus('loading')

    getDepartments()
      .then((res) => {
        if (ignore) return
        setDepartments(res.data?.data || [])
        setStatus('success')
      })
      .catch(() => {
        if (ignore) return
        setStatus('error')
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="relative overflow-hidden bg-navy min-h-[90vh] flex items-center">
      {/* Ambient background layers */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 80% 20%, rgba(201,162,75,0.15), transparent 45%), radial-gradient(circle at 15% 80%, rgba(34,58,102,0.6), transparent 50%)',
          }}
        />
        {/* Subtle star field motif, echoing the logo */}
        {Array.from({ length: 18 }).map((_, i) => (
          <FaStar
            key={i}
            className="absolute text-[var(--color-gold)]"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              opacity: 0.08 + (i % 3) * 0.04,
              fontSize: `${8 + (i % 4) * 4}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="lg:col-span-7 text-center lg:text-right"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-gold)]/40 text-[var(--color-gold-light)] text-xs font-bold tracking-wide mb-6">
            <FaStar className="text-[var(--color-gold)]" /> أكاديمية متخصصة معتمدة على أربع ركائز
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.25] mb-6">
            {SITE.name}
          </h1>

          <p className="font-display text-2xl sm:text-3xl gold-gradient-text font-bold mb-6 leading-relaxed">
            {SITE.tagline}
          </p>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10">
            نؤهل الكوادر الإعلامية والأسرية والتربوية عبر برامج تدريبية احترافية تجمع بين الخبرة العملية
            والمعرفة المتخصصة، لبناء أجيال واعية وقادرة على الإبداع والتأثير.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button to="/contact" variant="primary" size="lg">
              سجل الآن
            </Button>
            <Button to="/programs" variant="outlineGold" size="lg">
              استكشف البرامج
            </Button>
          </div>
        </motion.div>

        {/* Departments preview grid within the hero (Phase 5B: fetched from the real API) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-5 grid grid-cols-2 gap-4"
        >
          {status === 'loading' && (
            <div className="col-span-2 flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-white/20 border-t-[var(--color-gold)] rounded-full animate-spin" />
            </div>
          )}

          {status === 'error' && (
            <p className="col-span-2 text-center text-white/60 text-sm py-6">تعذر تحميل الأقسام حاليًا.</p>
          )}

          {status === 'success' && departments.length === 0 && (
            <p className="col-span-2 text-center text-white/60 text-sm py-6">لا توجد أقسام متاحة حاليًا.</p>
          )}

          {status === 'success' &&
            departments.map((department) => {
              const iconKey = DEPARTMENT_ICON_MAP[department.slug] || DEFAULT_DEPARTMENT_ICON
              const Icon = PILLAR_ICON_MAP[iconKey]
              return (
                <div
                  key={department.slug}
                  className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:border-[var(--color-gold)]/50 transition-colors"
                >
                  {Icon && <Icon className="w-9 h-9" />}
                  <span className="font-display font-bold text-white text-sm sm:text-base">{department.name}</span>
                </div>
              )
            })}
        </motion.div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-offwhite to-transparent" />
    </section>
  )
}
