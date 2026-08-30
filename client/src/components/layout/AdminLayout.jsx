import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  HiOutlineViewGrid,
  HiOutlineOfficeBuilding,
  HiOutlineTag,
  HiOutlineAcademicCap,
  HiOutlineUserGroup,
  HiOutlineNewspaper,
  HiOutlinePhotograph,
  HiOutlineChatAlt2,
  HiOutlineClipboardList,
  HiOutlineMail,
  HiOutlineCog,
  HiOutlineLogout,
  HiMenuAlt3,
  HiX,
} from 'react-icons/hi'
import { useAdminAuth } from '@/context/AdminAuthContext'
import logo from '@/assets/images/logo.png'
import { SITE } from '@/lib/constants'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'نظرة عامة', icon: HiOutlineViewGrid },
  { to: '/admin/departments', label: 'الأقسام', icon: HiOutlineOfficeBuilding },
  { to: '/admin/services', label: 'الخدمات', icon: HiOutlineTag },
  { to: '/admin/programs', label: 'البرامج', icon: HiOutlineAcademicCap },
  { to: '/admin/trainers', label: 'المدربون', icon: HiOutlineUserGroup },
  { to: '/admin/media', label: 'الإعلام والأخبار', icon: HiOutlineNewspaper },
  { to: '/admin/gallery', label: 'معرض الصور', icon: HiOutlinePhotograph },
  { to: '/admin/testimonials', label: 'آراء المتدربين', icon: HiOutlineChatAlt2 },
  { to: '/admin/registrations', label: 'طلبات التسجيل', icon: HiOutlineClipboardList },
  { to: '/admin/messages', label: 'رسائل التواصل', icon: HiOutlineMail },
  { to: '/admin/settings', label: 'إعدادات الموقع', icon: HiOutlineCog },
]

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <img src={logo} alt={SITE.name} className="h-10 w-auto" />
        <span className="font-display font-bold text-white text-sm">لوحة التحكم</span>
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
                  isActive ? 'gold-gradient text-navy' : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-white/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <HiOutlineLogout size={18} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-offwhite flex" dir="rtl">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-navy">{SidebarContent}</aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-navy">{SidebarContent}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-soft px-4 md:px-8 py-4 flex items-center justify-between">
          <button className="lg:hidden text-navy text-2xl" onClick={() => setSidebarOpen(true)} aria-label="فتح القائمة">
            <HiMenuAlt3 />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-navy">{admin?.name || 'الأدمن'}</span>
            <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-navy font-bold text-sm">
              {(admin?.name || 'A').charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 lg:hidden text-white text-2xl bg-navy rounded-full p-2"
          onClick={() => setSidebarOpen(false)}
          aria-label="إغلاق القائمة"
        >
          <HiX />
        </button>
      )}
    </div>
  )
}
