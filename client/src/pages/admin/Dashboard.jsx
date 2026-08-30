import { HiOutlineAcademicCap, HiOutlineUserGroup, HiOutlineClipboardList, HiOutlineMail } from 'react-icons/hi'

const STAT_CARDS = [
  { label: 'إجمالي البرامج', value: '—', icon: HiOutlineAcademicCap },
  { label: 'إجمالي المدربين', value: '—', icon: HiOutlineUserGroup },
  { label: 'طلبات تسجيل جديدة', value: '—', icon: HiOutlineClipboardList },
  { label: 'رسائل غير مقروءة', value: '—', icon: HiOutlineMail },
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy mb-2">نظرة عامة</h1>
      <p className="text-muted text-sm mb-8">
        ستُعرض هنا الإحصائيات الفعلية بمجرد ربط لوحة التحكم بالكامل بالـ API في المرحلة القادمة.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-soft p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                <Icon className="text-[var(--color-gold)]" size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{card.value}</p>
                <p className="text-xs text-muted">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
        هذه لوحة تحكم بالهيكل الأساسي (Phase 1). شاشات الإدارة الكاملة لكل مورد (برامج، مدربون، أخبار،
        آراء، تسجيلات، رسائل، إعدادات) سيتم بناؤها في مرحلة لاحقة مع اكتمال الـ API.
      </div>
    </div>
  )
}
