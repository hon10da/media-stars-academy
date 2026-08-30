import { useEffect, useState } from 'react'
import { AdminPageHeader, RowActions, StatusPill } from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import { FormField, TextInput, TextArea, Select } from '@/components/admin/FormField'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

import {
  getAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
} from '@/api/adminTestimonials.api'

const EMPTY_FORM = {
  studentName: '',
  role: '',
  quote: '',
  photoUrl: '',
  rating: '',
  status: 'draft',
  order: 0,
}

const extractList = (response) => {
  const data = response?.data

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data

  return []
}

const extractItem = (response) => {
  const data = response?.data

  if (data?._id) return data
  if (data?.data?._id) return data.data

  return null
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    err?.message ||
    'حدث خطأ، برجاء المحاولة مرة أخرى.'

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getAdminTestimonials()

      setTestimonials(extractList(response))
    } catch (err) {
      console.error('Failed to load testimonials:', err)
      setError(getErrorMessage(err))
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const openCreate = () => {
    setEditingTestimonial(null)
    setForm({ ...EMPTY_FORM })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (testimonial) => {
    setEditingTestimonial(testimonial)

    setForm({
      studentName: testimonial.studentName || '',
      role: testimonial.role || '',
      quote: testimonial.quote || '',
      photoUrl: testimonial.photoUrl || '',
      rating:
        testimonial.rating !== null &&
        testimonial.rating !== undefined
          ? testimonial.rating
          : '',
      status: testimonial.status || 'draft',
      order: testimonial.order ?? 0,
    })

    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setModalOpen(false)
    setEditingTestimonial(null)
    setForm({ ...EMPTY_FORM })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.studentName.trim()) {
      setError('اسم المتدرب مطلوب')
      return
    }

    if (!form.quote.trim()) {
      setError('رأي المتدرب مطلوب')
      return
    }

    try {
      setSaving(true)
      setError('')

      const payload = {
        studentName: form.studentName.trim(),
        role: form.role.trim(),
        quote: form.quote.trim(),
        photoUrl: form.photoUrl.trim(),
        rating:
          form.rating === ''
            ? null
            : Number(form.rating),
        status: form.status,
        order: Number(form.order) || 0,
      }

      if (editingTestimonial) {
        const response = await updateAdminTestimonial(
          editingTestimonial._id,
          payload
        )

        const updated = extractItem(response)

        if (updated) {
          setTestimonials((current) =>
            current.map((item) =>
              String(item._id) === String(updated._id)
                ? updated
                : item
            )
          )
        } else {
          await loadTestimonials()
        }
      } else {
        const response = await createAdminTestimonial(payload)

        const created = extractItem(response)

        if (created) {
          setTestimonials((current) => [
            created,
            ...current,
          ])
        } else {
          await loadTestimonials()
        }
      }

      closeModal()
    } catch (err) {
      console.error('Failed to save testimonial:', err)
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setDeleting(true)
      setError('')

      await deleteAdminTestimonial(deleteTarget._id)

      setTestimonials((current) =>
        current.filter(
          (item) =>
            String(item._id) !== String(deleteTarget._id)
        )
      )

      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete testimonial:', err)
      setError(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'studentName',
      label: 'المتدرب',
      render: (testimonial) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          {testimonial.photoUrl ? (
            <img
              src={testimonial.photoUrl}
              alt={testimonial.studentName}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-navy/10 flex items-center justify-center text-xs text-muted">
              صورة
            </div>
          )}

          <div>
            <div className="font-bold text-navy">
              {testimonial.studentName}
            </div>

            {testimonial.role && (
              <div className="text-xs text-muted mt-1">
                {testimonial.role}
              </div>
            )}
          </div>
        </div>
      ),
    },

    {
      key: 'quote',
      label: 'الرأي',
      render: (testimonial) => (
        <div className="max-w-md line-clamp-2">
          {testimonial.quote}
        </div>
      ),
    },

    {
      key: 'rating',
      label: 'التقييم',
      render: (testimonial) =>
        testimonial.rating
          ? `${'★'.repeat(testimonial.rating)}${'☆'.repeat(
              5 - testimonial.rating
            )}`
          : '—',
    },

    {
      key: 'status',
      label: 'الحالة',
      render: (testimonial) => (
        <StatusPill status={testimonial.status} />
      ),
    },

    {
      key: 'order',
      label: 'الترتيب',
      render: (testimonial) =>
        testimonial.order ?? 0,
    },

    {
      key: 'actions',
      label: 'الإجراءات',
      render: (testimonial) => (
        <RowActions
          onEdit={() => openEdit(testimonial)}
          onDelete={() => setDeleteTarget(testimonial)}
        />
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="آراء المتدربين"
        description="إدارة آراء وتجارب المتدربين الظاهرة على الموقع."
        onCreate={openCreate}
        createLabel="إضافة رأي"
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={testimonials}
        status={loading ? 'loading' : 'success'}
        errorMessage={error}
        emptyMessage="لا توجد آراء للمتدربين حاليًا."
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingTestimonial
            ? 'تعديل رأي المتدرب'
            : 'إضافة رأي متدرب'
        }
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <FormField label="اسم المتدرب">
            <TextInput
              value={form.studentName}
              onChange={(event) =>
                updateField(
                  'studentName',
                  event.target.value
                )
              }
              required
            />
          </FormField>

          <FormField label="الصفة / البرنامج">
            <TextInput
              value={form.role}
              onChange={(event) =>
                updateField('role', event.target.value)
              }
              placeholder="مثال: متدرب في برنامج الإعلام"
            />
          </FormField>

          <FormField label="الرأي">
            <TextArea
              rows={5}
              value={form.quote}
              onChange={(event) =>
                updateField('quote', event.target.value)
              }
              required
            />
          </FormField>

          <FormField label="صورة المتدرب">
            <TextInput
              value={form.photoUrl}
              onChange={(event) =>
                updateField(
                  'photoUrl',
                  event.target.value
                )
              }
              placeholder="رابط الصورة"
            />
          </FormField>

          <FormField label="التقييم">
            <Select
              value={form.rating}
              onChange={(event) =>
                updateField('rating', event.target.value)
              }
            >
              <option value="">بدون تقييم</option>
              <option value="1">1 من 5</option>
              <option value="2">2 من 5</option>
              <option value="3">3 من 5</option>
              <option value="4">4 من 5</option>
              <option value="5">5 من 5</option>
            </Select>
          </FormField>

          <FormField label="الحالة">
            <Select
              value={form.status}
              onChange={(event) =>
                updateField('status', event.target.value)
              }
            >
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
            </Select>
          </FormField>

          <FormField label="الترتيب">
            <TextInput
              type="number"
              value={form.order}
              onChange={(event) =>
                updateField('order', event.target.value)
              }
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg font-bold bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg font-bold gold-gradient text-navy disabled:opacity-60"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!deleting) {
            setDeleteTarget(null)
          }
        }}
        onConfirm={handleDelete}
        title="حذف رأي المتدرب"
        message={
          deleteTarget
            ? `هل أنت متأكد من حذف رأي "${deleteTarget.studentName}"؟`
            : ''
        }
        loading={deleting}
      />
    </div>
  )
}