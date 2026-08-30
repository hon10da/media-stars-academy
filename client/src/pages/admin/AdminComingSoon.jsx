export default function AdminComingSoon({ title }) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy mb-2">{title}</h1>
      <p className="text-muted text-sm mb-8">
        شاشة الإدارة الكاملة لهذا القسم ستُبنى في مرحلة لاحقة بعد اكتمال الـ API الخاص به.
      </p>
      <div className="bg-white rounded-xl shadow-soft p-10 text-center text-muted text-sm">
        قريبًا
      </div>
    </div>
  )
}
