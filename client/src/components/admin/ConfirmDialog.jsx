import Modal from './Modal'
import Button from '@/components/ui/Button'

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'تأكيد الحذف',
  message = 'هل أنت متأكد من رغبتك في الحذف؟ لا يمكن التراجع عن هذا الإجراء.',
  confirmLabel = 'حذف',
  loading = false,
  errorMessage = '',
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-muted text-sm leading-relaxed mb-6">{message}</p>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-[var(--color-danger)] mb-4">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
          إلغاء
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          disabled={loading}
          className="!bg-[var(--color-danger)] !bg-none text-white hover:opacity-90"
        >
          {loading ? 'جارٍ الحذف...' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
