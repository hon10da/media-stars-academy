import { useState, useEffect, useCallback, useMemo } from 'react'
import { AdminPageHeader, RowActions, StatusPill } from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { FormField, TextInput, TextArea, Select, CheckboxGroup } from '@/components/admin/FormField'
import Button from '@/components/ui/Button'
import { getAdminDepartments } from '@/api/adminDepartments.api'
import { getAdminServices } from '@/api/adminServices.api'
import {
  getAdminPrograms,
  createAdminProgram,
  updateAdminProgram,
  deleteAdminProgram,
} from '@/api/adminPrograms.api'
import { getErrorMessage } from '@/lib/adminErrors'
import { DEPARTMENT_SLUG_TO_PILLAR } from '@/lib/constants'

const emptyForm = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  duration: '',
  level: '',
  coverImageUrl: '',
  departmentRef: '',
  serviceRefs: [],
  isFeatured: false,
  status: 'draft',
}

export default function ProgramsManager() {
  const [programs, setPrograms] = useState([])
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  // Real Departments/Services for the selectors — never hardcoded.
  const [departments, setDepartments] = useState([])
  const [services, setServices] = useState([])
  const [refsStatus, setRefsStatus] = useState('loading')

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
    getAdminPrograms()
      .then((res) => {
        setPrograms(res.data?.data || [])
        setStatus('success')
      })
      .catch((err) => {
        setErrorMessage(getErrorMessage(err, 'تعذر تحميل البرامج.'))
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    load()
    setRefsStatus('loading')
    Promise.all([getAdminDepartments(), getAdminServices()])
      .then(([deptRes, svcRes]) => {
        setDepartments(deptRes.data?.data || [])
        setServices(svcRes.data?.data || [])
        setRefsStatus('success')
      })
      .catch(() => setRefsStatus('error'))
  }, [load])

  const departmentById = useMemo(() => {
    const map = {}
    departments.forEach((d) => {
      map[d._id] = d
    })
    return map
  }, [departments])

  // Services are grouped under their department (departmentRef is populated
  // by the admin Services endpoint), then filtered to the currently selected
  // department so the checkbox list only shows relevant options.
  const servicesForSelectedDepartment = useMemo(() => {
    if (!form.departmentRef) return []
    return services.filter((s) => {
      const svcDeptId = s.departmentRef?._id || s.departmentRef
      return svcDeptId === form.departmentRef
    })
  }, [services, form.departmentRef])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEdit = (program) => {
    setEditingId(program._id)
    setForm({
      title: program.title || '',
      slug: program.slug || '',
      shortDescription: program.shortDescription || '',
      description: program.description || '',
      duration: program.duration || '',
      level: program.level || '',
      coverImageUrl: program.coverImageUrl || '',
      departmentRef: program.departmentRef || '',
      serviceRefs: program.serviceRefs || [],
      isFeatured: !!program.isFeatured,
      status: program.status || 'draft',
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('submitting')
    setFormError('')

    if (!form.departmentRef) {
      setFormError('يجب اختيار القسم.')
      setFormStatus('error')
      return
    }

    try {
      const department = departmentById[form.departmentRef]
      // Bridges to the legacy required `pillar` field automatically — see
      // DEPARTMENT_SLUG_TO_PILLAR in lib/constants.js. The admin never sees
      // or picks this value directly.
      const pillar = department ? DEPARTMENT_SLUG_TO_PILLAR[department.slug] || 'education' : 'education'

      const payload = { ...form, pillar }

      if (editingId) {
        await updateAdminProgram(editingId, payload)
      } else {
        await createAdminProgram(payload)
      }
      setModalOpen(false)
      setFormStatus('idle')
      load()
    } catch (err) {
      setFormError(getErrorMessage(err, 'تعذر حفظ البرنامج.'))
      setFormStatus('error')
    }
  }

  const handleDelete = async () => {
    setDeleteStatus('submitting')
    setDeleteError('')
    try {
      await deleteAdminProgram(deleteTarget._id)
      setDeleteTarget(null)
      setDeleteStatus('idle')
      load()
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'تعذر حذف البرنامج.'))
      setDeleteStatus('error')
    }
  }

  const columns = [
    { key: 'title', label: 'العنوان' },
    {
      key: 'departmentRef',
      label: 'القسم',
      render: (row) => departmentById[row.departmentRef]?.name || '—',
    },
    {
      key: 'isFeatured',
      label: 'مميز؟',
      render: (row) => (row.isFeatured ? 'نعم' : 'لا'),
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
        title="إدارة البرامج"
        description="البرامج التدريبية المرتبطة بأقسام الأكاديمية."
        onCreate={openCreate}
        createLabel="إضافة برنامج"
      />

      <DataTable
        columns={columns}
        rows={programs}
        status={status}
        errorMessage={errorMessage}
        emptyMessage="لا توجد برامج بعد."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'تعديل البرنامج' : 'إضافة برنامج جديد'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="القسم">
            <Select
              required
              value={form.departmentRef}
              onChange={(e) => setForm((f) => ({ ...f, departmentRef: e.target.value, serviceRefs: [] }))}
              disabled={refsStatus === 'loading'}
            >
              <option value="">{refsStatus === 'loading' ? 'جارٍ تحميل الأقسام...' : 'اختر القسم'}</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="الخدمات المرتبطة (اختياري)">
            {form.departmentRef ? (
              <CheckboxGroup
                options={servicesForSelectedDepartment}
                value={form.serviceRefs}
                onChange={(ids) => setForm((f) => ({ ...f, serviceRefs: ids }))}
              />
            ) : (
              <p className="text-xs text-muted">اختر القسم أولًا لعرض خدماته.</p>
            )}
          </FormField>

          <FormField label="عنوان البرنامج">
            <TextInput
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </FormField>

          <FormField label="المعرّف (slug)">
            <TextInput
              required
              dir="ltr"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="program-example"
            />
          </FormField>

          <FormField label="وصف مختصر">
            <TextArea
              required
              rows={2}
              value={form.shortDescription}
              onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
            />
          </FormField>

          <FormField label="وصف تفصيلي (اختياري)">
            <TextArea
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="المدة">
              <TextInput
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              />
            </FormField>
            <FormField label="المستوى">
              <TextInput
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              />
            </FormField>
          </div>

          <FormField label="رابط صورة الغلاف (اختياري)">
            <TextInput
              dir="ltr"
              value={form.coverImageUrl}
              onChange={(e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value }))}
              placeholder="https://..."
            />
          </FormField>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
              className="accent-[var(--color-gold)] w-4 h-4"
            />
            برنامج مميز (يظهر في الصفحة الرئيسية)
          </label>

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
        title="حذف البرنامج"
        message={`هل أنت متأكد من حذف "${deleteTarget?.title}"؟`}
      />
    </div>
  )
}
