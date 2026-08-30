import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HiX } from 'react-icons/hi'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-navy/60" onClick={onClose} />
      <div
        className={`relative w-full ${sizes[size] || sizes.md} bg-white rounded-2xl shadow-lift max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10 sticky top-0 bg-white z-10">
          <h2 className="font-display font-bold text-lg text-navy">{title}</h2>
          <button
            onClick={onClose}
            className="text-navy/50 hover:text-navy transition-colors text-2xl leading-none"
            aria-label="إغلاق"
          >
            <HiX />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}
