import { useState, useEffect, useCallback } from 'react'
import { AdminPageHeader, RowActions, StatusPill } from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { FormField, TextInput, TextArea, Select } from '@/components/admin/FormField'
import Button from '@/components/ui/Button'
import { getAdminDepartments } from '@/api/adminDepartments.api'
import {
  getAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} from '@/api/adminServices.api'
import { getErrorMessage } from '@/lib/adminErrors'

const emptyForm = { name: '', slug: '', description: '', icon: '', order: 0, status: 'draft', departmentRef: '' }

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  // Real Departments loaded from the API for the selector — never hardcoded.
  const [departments, setDepartments] = useState([])
  const [departmentsStatus, setDepartmentsStatus] = useState('loading')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formStatus, setFormStatus] = useState('idle')
  const [formError, setFormError] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteStatus, setDeleteStatus] = useState('idle')
  const [deleteError, setDeleteError] = useState('')

  const load = useCallback(() => {
    setStatus('loading')
    getAdminServices()
      .then((res) => {
        setServices(res.data?.data || [])
        setStatus('success')
      })
      .catch((err) => {
        setErrorMessage(getErrorMessage(err, 'تعذر تحميل الخدمات.'))
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    load()
    setDepartmentsStatus('loading')
    getAdminDepartments()
      .then((res) => {
        setDepartments(res.data?.data || [])
        setDepartmentsStatus('success')
      })
      .catch(() => setDepartmentsStatus('error'))
  }, [load])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (service) => {
    setEditingId(service._id)
    setForm({
      name: service.name || '',
      slug: service.slug || '',
      description: service.description || '',
      icon: service.icon || '',
      order: service.order ?? 0,
      status: service.status || 'draft',
      departmentRef: service.departmentRef?._id || service.departmentRef || '',
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
        await updateAdminService(editingId, payload)
      } else {
        await createAdminService(payload)
      }
      setModalOpen(false)
      setFormStatus('idle')
      load()
    } catch (err) {
      // Surfaces the backend's "القسم المحدد (departmentRef) غير موجود" validation
      // error (or any other) directly, rather than a generic failure message.
      setFormError(getErrorMessage(err, 'تعذر حفظ الخدمة.'))
      setFormStatus('error')
    }
  }

  const handleDelete = async () => {
    setDeleteStatus('submitting')
    setDeleteError('')
    try {
      await deleteAdminService(deleteTarget._id)
      setDeleteTarget(null)
      setDeleteStatus('idle')
      load()
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'تعذر حذف الخدمة.'))
      setDeleteStatus('error')
    }
  }

  const columns = [
    { key: 'order', label: 'الترتيب' },
    { key: 'name', label: 'الاسم' },
    {
      key: 'departmentRef',
      label: 'القسم',
      render: (row) => row.departmentRef?.name || '—',
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => <RowActions onEdit={() => openEdit(row)} onDelete={() => setDeleteTarget(row)} />,
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="إدارة الخدمات"
        description="الخدمات الفرعية تحت كل قسم."
        onCreate={openCreate}
        createLabel="إضافة خدمة"
      />

      <DataTable
        columns={columns}
        rows={services}
        status={status}
        errorMessage={errorMessage}
        emptyMessage="لا توجد خدمات بعد."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="القسم">
            <Select
              required
              value={form.departmentRef}
              onChange={(e) => setForm((f) => ({ ...f, departmentRef: e.target.value }))}
              disabled={departmentsStatus === 'loading'}
            >
              <option value="">
                {departmentsStatus === 'loading' ? 'جارٍ تحميل الأقسام...' : 'اختر القسم'}
              </option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </Select>
            {departmentsStatus === 'error' && (
              <p className="text-xs text-[var(--color-danger)]">تعذر تحميل قائمة الأقسام.</p>
            )}
          </FormField>

          <FormField label="اسم الخدمة">
            <TextInput
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="مثال: إرشاد أسري"
            />
          </FormField>

          <FormField label="المعرّف (slug)">
            <TextInput
              required
              dir="ltr"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="family-counseling"
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
        title="حذف الخدمة"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟`}
      />
    </div>
  )
}
