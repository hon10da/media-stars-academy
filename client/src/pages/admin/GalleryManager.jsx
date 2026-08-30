import { useEffect, useState } from 'react'
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiPhotograph,
} from 'react-icons/hi'

import Button from '@/components/ui/Button'
import { AdminPageHeader, StatusPill } from '@/components/admin/AdminPageHeader'
import axiosClient from '@/api/axiosClient'

export default function GalleryManager() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: null,
    showOnHome: true,
    status: 'published',
    order: 0,
  })

  const loadGallery = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axiosClient.get('/admin/gallery')
      setItems(response.data?.data || [])
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'تعذر تحميل صور المعرض.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGallery()
  }, [])

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      image: null,
      showOnHome: true,
      status: 'published',
      order: 0,
    })
    setEditingItem(null)
    setShowForm(false)
  }

  const handleEdit = (item) => {
    setEditingItem(item)

    setForm({
      title: item.title || '',
      description: item.description || '',
      image: null,
      showOnHome: item.showOnHome ?? false,
      status: item.status || 'published',
      order: item.order || 0,
    })

    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('showOnHome', form.showOnHome ? 'true' : 'false')
      formData.append('status', form.status)
      formData.append('order', String(form.order))

      if (form.image) {
        formData.append('image', form.image)
      }

      if (editingItem) {
        await axiosClient.put(
          `/admin/gallery/${editingItem._id}`,
          formData
        )
      } else {
        if (!form.image) {
          alert('من فضلك اختر صورة.')
          return
        }

        await axiosClient.post('/admin/gallery', formData)
      }

      resetForm()
      await loadGallery()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'حدث خطأ أثناء حفظ الصورة.'
      )
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'هل أنت متأكد من حذف هذه الصورة؟'
    )

    if (!confirmed) return

    try {
      await axiosClient.delete(`/admin/gallery/${id}`)
      await loadGallery()
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'حدث خطأ أثناء حذف الصورة.'
      )
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="معرض الصور"
        description="إدارة صور الأكاديمية التي تظهر في المعرض والصفحة الرئيسية."
        onCreate={() => {
          setEditingItem(null)
          setForm({
            title: '',
            description: '',
            image: null,
            showOnHome: true,
            status: 'published',
            order: 0,
          })
          setShowForm(true)
        }}
        createLabel="إضافة صورة"
      />

      {showForm && (
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <h2 className="font-bold text-navy text-lg mb-5">
            {editingItem ? 'تعديل الصورة' : 'إضافة صورة جديدة'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                الصورة
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.files?.[0] || null,
                  })
                }
                className="w-full border border-navy/10 rounded-lg p-3"
              />

              {editingItem && (
                <p className="text-muted text-xs mt-2">
                  اترك الحقل فارغًا للاحتفاظ بالصورة الحالية.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                العنوان
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="w-full border border-navy/10 rounded-lg px-4 py-3"
                placeholder="مثال: قاعة التدريب"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-navy mb-2">
                الوصف
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full border border-navy/10 rounded-lg px-4 py-3"
                placeholder="وصف مختصر للصورة..."
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showOnHome}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      showOnHome: e.target.checked,
                    })
                  }
                />
                <span className="text-sm font-bold text-navy">
                  عرض في الصفحة الرئيسية
                </span>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-sm font-bold text-navy">
                  الحالة
                </span>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  className="border border-navy/10 rounded-lg px-3 py-2"
                >
                  <option value="published">منشورة</option>
                  <option value="draft">مسودة</option>
                </select>
              </label>

              <label className="flex items-center gap-2">
                <span className="text-sm font-bold text-navy">
                  الترتيب
                </span>

                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      order: e.target.value,
                    })
                  }
                  className="w-24 border border-navy/10 rounded-lg px-3 py-2"
                />
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                {editingItem ? 'حفظ التعديلات' : 'رفع الصورة'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={resetForm}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-muted">
          جاري تحميل الصور...
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-white rounded-xl shadow-soft p-12 text-center">
          <HiPhotograph
            size={48}
            className="mx-auto mb-4 text-muted"
          />

          <p className="text-muted">
            لا توجد صور في المعرض حتى الآن.
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-soft overflow-hidden"
            >
              <div className="aspect-video bg-navy/5 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title || 'صورة من المعرض'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-navy">
                    {item.title || 'بدون عنوان'}
                  </h3>

                  <StatusPill status={item.status} />
                </div>

                {item.description && (
                  <p className="text-sm text-muted mb-4">
                    {item.description}
                  </p>
                )}

                <div className="text-xs text-muted mb-4">
                  {item.showOnHome
                    ? '✓ تظهر في الصفحة الرئيسية'
                    : 'لا تظهر في الصفحة الرئيسية'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-navy/5 text-navy py-2 font-bold text-sm hover:bg-navy/10"
                  >
                    <HiPencil size={16} />
                    تعديل
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-50 text-[var(--color-danger)] py-2 font-bold text-sm hover:bg-red-100"
                  >
                    <HiTrash size={16} />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}