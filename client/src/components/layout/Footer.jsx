import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { FaWhatsapp, FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'
import { SITE, FOOTER_LINKS, SOCIAL_LINKS, WHATSAPP_LINK } from '@/lib/constants'
import logo from '@/assets/images/logo.png'
import { getDepartments } from '@/api/departments.api'

const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
}

export default function Footer() {
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    let ignore = false

    getDepartments()
      .then((res) => {
        if (ignore) return
        setDepartments(res.data?.data || [])
      })
      .catch(() => {
        // Footer navigation is secondary content — fail quietly rather than
        // showing an intrusive error block in the site footer.
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={logo} alt={SITE.name} className="h-16 w-auto object-contain mb-4 bg-white/5 rounded-lg p-2" />
            <p className="text-white/70 text-sm leading-relaxed">{SITE.tagline}</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-[var(--color-gold-light)]">روابط سريعة</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.quick.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="text-white/70 hover:text-white text-sm transition-colors">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Departments (Phase 5B: fetched from the real API) */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-[var(--color-gold-light)]">مجالاتنا</h4>
            <ul className="space-y-3">
              {departments.map((department) => (
                <li key={department.slug}>
                  <NavLink
                    to={`/departments/${department.slug}`}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {department.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-[var(--color-gold-light)]">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <FaPhone className="text-[var(--color-gold)]" /> {SITE.phone}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_LINK()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <FaWhatsapp className="text-[var(--color-gold)]" /> واتساب
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                  <FaEnvelope className="text-[var(--color-gold)]" /> {SITE.email}
                </a>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              {SOCIAL_LINKS.map((s) => {
                const Icon = socialIcons[s.id]
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    aria-label={s.label}
                    className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:border-[var(--color-gold)] hover:text-[var(--color-gold-light)] transition-colors"
                  >
                    {Icon && <Icon size={14} />}
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {SITE.name}. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <NavLink key={link.to} to={link.to} className="hover:text-white transition-colors">
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
