import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/DataTable'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { getAdminRegistrations, updateAdminRegistrationStatus } from '@/api/adminRegistrations.api'
import { getErrorMessage } from '@/lib/adminErrors'

const STATUS_OPTIONS = [
  { value: '', label: 'كل الطلبات' },
  { value: 'new', label: 'جديد' },
  { value: 'contacted', label: 'تم التواصل' },
  { value: 'enrolled', label: 'تم التسجيل' },
  { value: 'closed', label: 'مغلق' },
]

const STATUS_LABELS = {
  new: 'جديد',
  contacted: 'تم التواصل',
  enrolled: 'تم التسجيل',
  closed: 'مغلق',
}

export default function RegistrationsManager() {
  const [registrations, setRegistrations] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadRegistrations = async () => {
    try {
      setStatus('loading')
      setErrorMessage('')

      const response = await getAdminRegistrations(
        statusFilter ? { status: statusFilter } : undefined
      )

      const data = response?.data?.data

      setRegistrations(Array.isArray(data) ? data : [])
      setStatus('success')
    } catch (error) {
      console.error('Failed to load registrations:', error)
      setErrorMessage(getErrorMessage(error))
      setStatus('error')
    }
  }

  useEffect(() => {
    loadRegistrations()
  }, [statusFilter])

  const handleStatusChange = async (registration, newStatus) => {
    if (!newStatus || newStatus === registration.status) return

    try {
      setUpdatingId(registration._id)
      setErrorMessage('')

      const response = await updateAdminRegistrationStatus(
        registration._id,
        newStatus
      )

      const updated = response?.data?.data

      setRegistrations((current) =>
        current.map((item) =>
          String(item._id) === String(registration._id)
            ? updated || { ...item, status: newStatus }
            : item
        )
      )
    } catch (error) {
      console.error('Failed to update registration status:', error)
      setErrorMessage(getErrorMessage(error))
    } finally {
      setUpdatingId(null)
    }
  }

  const columns = [
    {
      key: 'fullName',
      label: 'الاسم',
      render: (registration) => (
        <div>
          <div className="font-bold text-navy">
            {registration.fullName || '—'}
          </div>

          {registration.email && (
            <div className="text-xs text-muted mt-1">
              {registration.email}
            </div>
          )}
        </div>
      ),
    },

    {
      key: 'phone',
      label: 'الهاتف',
      render: (registration) => (
        <span dir="ltr" className="inline-block">
          {registration.phone || '—'}
        </span>
      ),
    },

    {
      key: 'program',
      label: 'البرنامج',
      render: (registration) => (
        <span>
          {registration.programRef?.title || 'غير محدد'}
        </span>
      ),
    },

    {
      key: 'preferredContactMethod',
      label: 'طريقة التواصل',
      render: (registration) => (
        <span>
          {registration.preferredContactMethod === 'whatsapp'
            ? 'واتساب'
            : 'النموذج'}
        </span>
      ),
    },

    {
      key: 'message',
      label: 'الرسالة',
      render: (registration) => (
        <div
          className="max-w-xs truncate text-muted"
          title={registration.message || ''}
        >
          {registration.message || '—'}
        </div>
      ),
    },

    {
      key: 'status',
      label: 'الحالة',
      render: (registration) => (
        <select
          value={registration.status || 'new'}
          disabled={updatingId === registration._id}
          onChange={(event) =>
            handleStatusChange(
              registration,
              event.target.value
            )
          }
          className="rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm font-bold text-navy outline-none focus:border-[var(--color-gold)] disabled:opacity-60"
        >
          {STATUS_OPTIONS.filter((option) => option.value).map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>
      ),
    },

    {
      key: 'createdAt',
      label: 'التاريخ',
      render: (registration) => {
        if (!registration.createdAt) return '—'

        return new Date(
          registration.createdAt
        ).toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      },
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="طلبات التسجيل"
        description="عرض ومتابعة طلبات التسجيل الواردة من الموقع."
      />

      <div className="bg-white rounded-xl shadow-soft p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm font-bold text-navy">
            تصفية حسب الحالة
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-navy/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div className="text-sm text-muted sm:mr-auto">
            {status === 'success'
              ? `عدد الطلبات: ${registrations.length}`
              : ''}
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={registrations}
        status={status}
        errorMessage={errorMessage}
        emptyMessage={
          statusFilter
            ? `لا توجد طلبات بحالة "${STATUS_LABELS[statusFilter]}".`
            : 'لا توجد طلبات تسجيل حاليًا.'
        }
      />
    </div>
  )
}