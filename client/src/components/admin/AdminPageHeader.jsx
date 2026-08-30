import { HiPencil, HiTrash, HiPlus } from 'react-icons/hi'
import Button from '@/components/ui/Button'

export function AdminPageHeader({ title, description, onCreate, createLabel = 'إضافة جديد' }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy mb-1">{title}</h1>
        {description && <p className="text-muted text-sm">{description}</p>}
      </div>
      {onCreate && (
        <Button variant="primary" size="sm" onClick={onCreate}>
          <HiPlus size={16} /> {createLabel}
        </Button>
      )}
    </div>
  )
}

export function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-navy hover:bg-navy/5 transition-colors"
          aria-label="تعديل"
        >
          <HiPencil size={16} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-danger)] hover:bg-red-50 transition-colors"
          aria-label="حذف"
        >
          <HiTrash size={16} />
        </button>
      )}
    </div>
  )
}

export function StatusPill({ status }) {
  const isPublished = status === 'published'
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
        isPublished ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}
    >
      {isPublished ? 'منشور' : 'مسودة'}
    </span>
  )
}
