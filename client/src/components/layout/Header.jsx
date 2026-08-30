import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { MAIN_NAV, SITE } from '@/lib/constants'
import Button from '@/components/ui/Button'
import logo from '@/assets/images/logo.png'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-soft py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="أكاديمية ميديا ستارز" className="h-12 md:h-14 w-auto object-contain" />
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative font-body font-bold text-sm transition-colors pb-1 ${
                  isActive
                    ? 'text-[var(--color-gold)]'
                    : scrolled
                    ? 'text-navy hover:text-[var(--color-gold)]'
                    : 'text-navy hover:text-[var(--color-gold)]'
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative">
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 inset-x-0 h-0.5 gold-gradient rounded-full"
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button to="/contact" variant="primary" size="sm">
            سجل الآن
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-navy text-3xl"
          onClick={() => setMenuOpen(true)}
          aria-label="فتح القائمة"
        >
          <HiMenuAlt3 />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/60 z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 bottom-0 right-0 w-[80%] max-w-sm bg-navy z-50 lg:hidden flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-10">
                <img src={logo} alt={SITE.name} className="h-10 w-auto" />
                <button onClick={() => setMenuOpen(false)} className="text-white text-3xl" aria-label="إغلاق القائمة">
                  <HiX />
                </button>
              </div>
              <nav className="flex flex-col gap-6">
                {MAIN_NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `font-body font-bold text-lg ${isActive ? 'text-[var(--color-gold-light)]' : 'text-white/90'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-auto pt-8">
                <Button to="/contact" variant="primary" className="w-full" onClick={() => setMenuOpen(false)}>
                  سجل الآن
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
