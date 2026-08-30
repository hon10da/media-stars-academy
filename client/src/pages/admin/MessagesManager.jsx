import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/DataTable'
import { getAdminMessages, updateAdminMessageStatus } from '@/api/adminMessages.api'

const STATUS_LABELS = {
  unread: 'غير مقروءة',
  read: 'تمت القراءة',
  replied: 'تم الرد',
}

export default function MessagesManager() {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const loadMessages = async () => {
    try {
      setStatus('loading')
      setErrorMessage('')

      const res = await getAdminMessages()
      const data = res.data?.data

      setMessages(Array.isArray(data) ? data : [])
      setStatus('success')
    } catch (err) {
      console.error(err)

      setErrorMessage(
        err?.response?.data?.message ||
          'تعذر تحميل الرسائل، برجاء المحاولة مرة أخرى.'
      )

      setStatus('error')
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const changeStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id)
      setErrorMessage('')

      const res = await updateAdminMessageStatus(id, newStatus)
      const updated = res.data?.data

      if (updated?._id) {
        setMessages((current) =>
          current.map((message) =>
            String(message._id) === String(updated._id)
              ? updated
              : message
          )
        )
      } else {
        await loadMessages()
      }
    } catch (err) {
      console.error(err)

      setErrorMessage(
        err?.response?.data?.message ||
          'تعذر تحديث حالة الرسالة.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const columns = [
    {
      key: 'fullName',
      label: 'الاسم',
      render: (message) => (
        <div className="font-bold text-navy min-w-[140px]">
          {message.fullName || '—'}
        </div>
      ),
    },

    {
      key: 'phone',
      label: 'رقم الهاتف',
      render: (message) => (
        <span dir="ltr">
          {message.phone || '—'}
        </span>
      ),
    },

    {
      key: 'email',
      label: 'البريد الإلكتروني',
      render: (message) => (
        <span dir="ltr">
          {message.email || '—'}
        </span>
      ),
    },

    {
      key: 'subject',
      label: 'الموضوع',
      render: (message) => (
        <div className="max-w-[180px] truncate">
          {message.subject || '—'}
        </div>
      ),
    },

    {
      key: 'message',
      label: 'الرسالة',
      render: (message) => (
        <div className="max-w-[280px] line-clamp-2">
          {message.message || '—'}
        </div>
      ),
    },

    {
      key: 'status',
      label: 'الحالة',
      render: (message) => (
        <div className="flex flex-col gap-2 min-w-[140px]">
          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${
              message.status === 'unread'
                ? 'bg-red-100 text-red-700'
                : message.status === 'read'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
            }`}
          >
            {STATUS_LABELS[message.status] || message.status || '—'}
          </span>

          <select
            value={message.status || 'unread'}
            disabled={updatingId === message._id}
            onChange={(event) =>
              changeStatus(
                message._id,
                event.target.value
              )
            }
            className="border border-navy/10 rounded-lg px-2 py-1.5 text-xs bg-white outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30"
          >
            <option value="unread">
              غير مقروءة
            </option>

            <option value="read">
              تمت القراءة
            </option>

            <option value="replied">
              تم الرد
            </option>
          </select>
        </div>
      ),
    },

    {
      key: 'createdAt',
      label: 'التاريخ',
      render: (message) =>
        message.createdAt
          ? new Date(message.createdAt).toLocaleDateString(
              'ar-EG',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }
            )
          : '—',
    },
  ]

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">
            رسائل التواصل
          </h1>

          <p className="text-muted text-sm mt-1">
            عرض رسائل الزوار ومتابعة حالة كل رسالة.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          className="px-5 py-2.5 rounded-lg bg-navy text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          تحديث الرسائل
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {errorMessage}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={messages}
        status={status}
        errorMessage={errorMessage}
        emptyMessage="لا توجد رسائل تواصل حاليًا."
      />
    </div>
  )
}