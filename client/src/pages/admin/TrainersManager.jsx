import { useEffect, useMemo, useState } from 'react'
import { AdminPageHeader, RowActions, StatusPill } from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import { FormField, TextInput, TextArea, Select, CheckboxGroup } from '@/components/admin/FormField'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import {
  getAdminTrainers,
  createAdminTrainer,
  updateAdminTrainer,
  deleteAdminTrainer,
} from '@/api/adminTrainers.api'
import { getAdminDepartments } from '@/api/adminDepartments.api'
import { getAdminServices } from '@/api/adminServices.api'
import { getErrorMessage } from '@/lib/adminErrors'

const EMPTY_FORM = {
  name: '',
  slug: '',
  specialty: '',
  bio: '',
  photoUrl: '',
  departmentRefs: [],
  serviceRefs: [],
  credentials: '',
  status: 'draft',
}

const extractList = (response) => {
  const first = response?.data

  if (Array.isArray(first)) return first
  if (Array.isArray(first?.data)) return first.data

  return []
}

const extractItem = (response) => {
  const first = response?.data

  if (first?._id) return first
  if (first?.data?._id) return first.data

  return null
}

export default function TrainersManager() {
  const [trainers, setTrainers] = useState([])
  const [departments, setDepartments] = useState([])
  const [services, setServices] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const departmentById = useMemo(
    () =>
      new Map(
        departments.map((department) => [
          String(department._id),
          department,
        ])
      ),
    [departments]
  )

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        trainersResponse,
        departmentsResponse,
        servicesResponse,
      ] = await Promise.all([
        getAdminTrainers(),
        getAdminDepartments(),
        getAdminServices(),
      ])

      setTrainers(extractList(trainersResponse))
      setDepartments(extractList(departmentsResponse))
      setServices(extractList(servicesResponse))
    } catch (err) {
      console.error('Failed to load trainers admin data:', err)
      setError(getErrorMessage(err))
      setTrainers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        _id: String(department._id),
        name: department.name,
      })),
    [departments]
  )

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        _id: String(service._id),
        name: service.name,
      })),
    [services]
  )

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const openCreate = () => {
    setEditingTrainer(null)
    setForm({ ...EMPTY_FORM })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (trainer) => {
    setEditingTrainer(trainer)

    setForm({
      name: trainer.name || '',
      slug: trainer.slug || '',
      specialty: trainer.specialty || '',
      bio: trainer.bio || '',
      photoUrl: trainer.photoUrl || '',
      departmentRefs: (trainer.departmentRefs || []).map(String),
      serviceRefs: (trainer.serviceRefs || []).map(String),
      credentials: Array.isArray(trainer.credentials)
        ? trainer.credentials.join('\n')
        : '',
      status: trainer.status || 'draft',
    })

    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setModalOpen(false)
    setEditingTrainer(null)
    setForm({ ...EMPTY_FORM })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('اسم المدرب مطلوب')
      return
    }

    if (!form.slug.trim()) {
      setError('الرابط المختصر مطلوب')
      return
    }

    try {
      setSaving(true)
      setError('')

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        specialty: form.specialty.trim(),
        bio: form.bio.trim(),
        photoUrl: form.photoUrl.trim(),
        departmentRefs: form.departmentRefs,
        serviceRefs: form.serviceRefs,
        credentials: form.credentials
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        status: form.status,
      }

      if (editingTrainer) {
        const response = await updateAdminTrainer(
          editingTrainer._id,
          payload
        )

        const updatedTrainer = extractItem(response)

        if (updatedTrainer) {
          setTrainers((current) =>
            current.map((trainer) =>
              String(trainer._id) === String(updatedTrainer._id)
                ? updatedTrainer
                : trainer
            )
          )
        } else {
          await loadData()
        }
      } else {
        const response = await createAdminTrainer(payload)

        const newTrainer = extractItem(response)

        if (newTrainer) {
          setTrainers((current) => [newTrainer, ...current])
        } else {
          await loadData()
        }
      }

      closeModal()
    } catch (err) {
      console.error('Failed to save trainer:', err)
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

      await deleteAdminTrainer(deleteTarget._id)

      setTrainers((current) =>
        current.filter(
          (trainer) =>
            String(trainer._id) !== String(deleteTarget._id)
        )
      )

      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete trainer:', err)
      setError(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'المدرب',
      render: (trainer) => (
        <div className="flex items-center gap-3">
          {trainer.photoUrl ? (
            <img
              src={trainer.photoUrl}
              alt={trainer.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold">
              {trainer.name?.charAt(0) || '?'}
            </div>
          )}

          <div>
            <div className="font-bold text-navy">
              {trainer.name}
            </div>

            <div className="text-xs text-muted">
              {trainer.specialty || 'بدون تخصص'}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: 'departments',
      label: 'الأقسام',
      render: (trainer) => {
        const names = (trainer.departmentRefs || [])
          .map((id) =>
            departmentById.get(String(id))?.name
          )
          .filter(Boolean)

        return names.length ? names.join('، ') : '—'
      },
    },

    {
      key: 'status',
      label: 'الحالة',
      render: (trainer) => (
        <StatusPill status={trainer.status} />
      ),
    },

    {
      key: 'actions',
      label: 'الإجراءات',
      render: (trainer) => (
        <RowActions
          onEdit={() => openEdit(trainer)}
          onDelete={() => setDeleteTarget(trainer)}
        />
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="إدارة المدربين"
        description="إضافة وتعديل وحذف المدربين وربطهم بالأقسام والخدمات."
        onCreate={openCreate}
        createLabel="إضافة مدرب"
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={trainers}
        status={loading ? 'loading' : 'success'}
        errorMessage={error}
        emptyMessage="لا يوجد مدربون حاليًا."
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingTrainer
            ? 'تعديل المدرب'
            : 'إضافة مدرب'
        }
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <FormField label="اسم المدرب">
            <TextInput
              value={form.name}
              onChange={(event) =>
                updateField('name', event.target.value)
              }
              required
            />
          </FormField>

          <FormField label="Slug">
            <TextInput
              value={form.slug}
              onChange={(event) =>
                updateField('slug', event.target.value)
              }
              required
            />
          </FormField>

          <FormField label="التخصص">
            <TextInput
              value={form.specialty}
              onChange={(event) =>
                updateField('specialty', event.target.value)
              }
            />
          </FormField>

          <FormField label="رابط الصورة">
            <TextInput
              value={form.photoUrl}
              onChange={(event) =>
                updateField('photoUrl', event.target.value)
              }
            />
          </FormField>

          <FormField label="نبذة عن المدرب">
            <TextArea
              rows={5}
              value={form.bio}
              onChange={(event) =>
                updateField('bio', event.target.value)
              }
            />
          </FormField>

          <FormField label="الأقسام">
            <CheckboxGroup
              options={departmentOptions}
              value={form.departmentRefs}
              onChange={(value) =>
                updateField('departmentRefs', value)
              }
            />
          </FormField>

          <FormField label="الخدمات">
            <CheckboxGroup
              options={serviceOptions}
              value={form.serviceRefs}
              onChange={(value) =>
                updateField('serviceRefs', value)
              }
            />
          </FormField>

          <FormField label="المؤهلات والشهادات">
            <TextArea
              rows={5}
              value={form.credentials}
              onChange={(event) =>
                updateField(
                  'credentials',
                  event.target.value
                )
              }
              placeholder="اكتب كل مؤهل أو شهادة في سطر منفصل"
            />
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
        title="حذف المدرب"
        message={
          deleteTarget
            ? `هل أنت متأكد من حذف ${deleteTarget.name || 'هذا المدرب'}؟`
            : ''
        }
        loading={deleting}
      />
    </div>
  )
}