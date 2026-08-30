import { useState, useEffect, useCallback } from 'react'
import { AdminPageHeader, RowActions, StatusPill } from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { FormField, TextInput, TextArea, Select } from '@/components/admin/FormField'
import Button from '@/components/ui/Button'
import {
  getAdminDepartments,
  createAdminDepartment,
  updateAdminDepartment,
  deleteAdminDepartment,
} from '@/api/adminDepartments.api'
import { getErrorMessage } from '@/lib/adminErrors'

const emptyForm = { name: '', slug: '', description: '', icon: '', order: 0, status: 'draft' }

export default function DepartmentsManager() {
  const [departments, setDepartments] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formStatus, setFormStatus] = useState('idle') // idle | submitting | error
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteStatus, setDeleteStatus] = useState('idle')
  const [deleteError, setDeleteError] = useState('')

  const load = useCallback(() => {
    setStatus('loading')
    getAdminDepartments()
      .then((res) => {
        setDepartments(res.data?.data || [])
        setStatus('success')
      })
      .catch((err) => {
        setErrorMessage(getErrorMessage(err, 'تعذر تحميل الأقسام.'))
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (dept) => {
    setEditingId(dept._id)
    setForm({
      name: dept.name || '',
      slug: dept.slug || '',
      description: dept.description || '',
      icon: dept.icon || '',
      order: dept.order ?? 0,
      status: dept.status || 'draft',
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')
    setFormError('')
    try {
      const payload = { ...form, order: Number(form.order) || 0 }
      if (editingId) {
        await updateAdminDepartment(editingId, payload)
      } else {
        await createAdminDepartment(payload)
      }
      setModalOpen(false)
      setFormStatus('idle')
      load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'تعذر حفظ القسم.'))
      setFormStatus('error')
    }
  }

  const handleDelete = async () => {
    setDeleteStatus('submitting')
    setDeleteError('')
    try {
      await deleteAdminDepartment(deleteTarget._id)
      setDeleteTarget(null)
      setDeleteStatus('idle')
      load()
    } catch (err) {
      // Surfaces backend referential-integrity errors (e.g. HTTP 409 when
      // services still reference this department) clearly in Arabic.
      setDeleteError(getErrorMessage(err, 'تعذر حذف القسم.'))
      setDeleteStatus('error')
    }
  }

  const columns = [
    { key: 'order', label: 'الترتيب' },
    { key: 'name', label: 'الاسم' },
    { key: 'slug', label: 'المعرّف (slug)' },
    {
      key: 'status',
      label: 'الحالة',
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      key: 'isPlaceholder',
      label: 'تجريبي؟',
      render: (row) => (row.isPlaceholder ? 'نعم' : 'لا'),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <RowActions onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} />
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="إدارة الأقسام"
        description="الأقسام الرئيسية للأكاديمية (الصحة النفسية، الإعلام، التنمية البشرية...)."
        onCreate={openCreate}
        createLabel="إضافة قسم"
      />

      <DataTable
        columns={columns}
        rows={departments}
        status={status}
        errorMessage={errorMessage}
        emptyMessage="لا توجد أقسام بعد."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'تعديل القسم' : 'إضافة قسم جديد'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="الاسم">
            <TextInput
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="مثال: قسم الصحة النفسية"
            />
          </FormField>

          <FormField label="المعرّف (slug)">
            <TextInput
              required
              dir="ltr"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="mental-health"
            />
          </FormField>

          <FormField label="الوصف">
            <TextArea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="الأيقونة (اختياري)">
              <TextInput
                dir="ltr"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="microphone"
              />
            </FormField>
            <FormField label="الترتيب">
              <TextInput
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
              />
            </FormField>
          </div>

          <FormField label="الحالة">
            <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
            </Select>
          </FormField>

          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={formStatus === 'submitting'}>
              {formStatus === 'submitting' ? 'جارٍ الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => {
          setDeleteTarget(null)
          setDeleteError('')
        }}
        onConfirm={handleDelete}
        loading={deleteStatus === 'submitting'}
        errorMessage={deleteError}
        title="حذف القسم"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟`}
      />
    </div>
  )
}
