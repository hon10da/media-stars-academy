import { useEffect, useState } from 'react'
import { AdminPageHeader, RowActions, StatusPill } from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import { FormField, TextInput, TextArea, Select } from '@/components/admin/FormField'
import Modal from '@/components/admin/Modal'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import {
  getAdminMediaPosts,
  createAdminMediaPost,
  updateAdminMediaPost,
  deleteAdminMediaPost,
} from '@/api/adminMedia.api'
import { getErrorMessage } from '@/lib/adminErrors'

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  coverImageUrl: '',
  category: 'news',
  externalVideoUrl: '',
  publishedAt: '',
  status: 'draft',
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

const CATEGORY_LABELS = {
  news: 'خبر',
  press: 'صحافة',
  video: 'فيديو',
  article: 'مقال',
}

export default function MediaManager() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getAdminMediaPosts()

      setPosts(extractList(response))
    } catch (err) {
      console.error('Failed to load media posts:', err)
      setError(getErrorMessage(err))
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const openCreate = () => {
    setEditingPost(null)
    setForm({
      ...EMPTY_FORM,
      publishedAt: new Date().toISOString().slice(0, 16),
    })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (post) => {
    setEditingPost(post)

    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      body: post.body || '',
      coverImageUrl: post.coverImageUrl || '',
      category: post.category || 'news',
      externalVideoUrl: post.externalVideoUrl || '',
      publishedAt: post.publishedAt
        ? new Date(post.publishedAt).toISOString().slice(0, 16)
        : '',
      status: post.status || 'draft',
    })

    setError('')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return

    setModalOpen(false)
    setEditingPost(null)
    setForm({ ...EMPTY_FORM })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim()) {
      setError('عنوان الخبر أو المقال مطلوب')
      return
    }

    if (!form.slug.trim()) {
      setError('Slug مطلوب')
      return
    }

    try {
      setSaving(true)
      setError('')

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        body: form.body.trim(),
        coverImageUrl: form.coverImageUrl.trim(),
        category: form.category,
        externalVideoUrl: form.externalVideoUrl.trim(),
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : new Date().toISOString(),
        status: form.status,
      }

      if (editingPost) {
        const response = await updateAdminMediaPost(
          editingPost._id,
          payload
        )

        const updatedPost = extractItem(response)

        if (updatedPost) {
          setPosts((current) =>
            current.map((post) =>
              String(post._id) === String(updatedPost._id)
                ? updatedPost
                : post
            )
          )
        } else {
          await loadPosts()
        }
      } else {
        const response = await createAdminMediaPost(payload)

        const newPost = extractItem(response)

        if (newPost) {
          setPosts((current) => [newPost, ...current])
        } else {
          await loadPosts()
        }
      }

      closeModal()
    } catch (err) {
      console.error('Failed to save media post:', err)
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

      await deleteAdminMediaPost(deleteTarget._id)

      setPosts((current) =>
        current.filter(
          (post) =>
            String(post._id) !== String(deleteTarget._id)
        )
      )

      setDeleteTarget(null)
    } catch (err) {
      console.error('Failed to delete media post:', err)
      setError(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'العنوان',
      render: (post) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          {post.coverImageUrl ? (
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-14 h-10 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-10 rounded-lg bg-navy/10 flex items-center justify-center text-xs text-muted shrink-0">
              بدون صورة
            </div>
          )}

          <div>
            <div className="font-bold text-navy">
              {post.title}
            </div>

            {post.excerpt && (
              <div className="text-xs text-muted mt-1 max-w-xs truncate">
                {post.excerpt}
              </div>
            )}
          </div>
        </div>
      ),
    },

    {
      key: 'category',
      label: 'التصنيف',
      render: (post) =>
        CATEGORY_LABELS[post.category] || post.category || '—',
    },

    {
      key: 'status',
      label: 'الحالة',
      render: (post) => (
        <StatusPill status={post.status} />
      ),
    },

    {
      key: 'publishedAt',
      label: 'تاريخ النشر',
      render: (post) =>
        post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString(
              'ar-EG',
              {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }
            )
          : '—',
    },

    {
      key: 'actions',
      label: 'الإجراءات',
      render: (post) => (
        <RowActions
          onEdit={() => openEdit(post)}
          onDelete={() => setDeleteTarget(post)}
        />
      ),
    },
  ]

  return (
    <div>
      <AdminPageHeader
        title="الإعلام والأخبار"
        description="إدارة الأخبار والمقالات والمواد الإعلامية المنشورة على الموقع."
        onCreate={openCreate}
        createLabel="إضافة مادة"
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={posts}
        status={loading ? 'loading' : 'success'}
        errorMessage={error}
        emptyMessage="لا توجد مواد إعلامية حاليًا."
      />

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingPost
            ? 'تعديل المادة الإعلامية'
            : 'إضافة مادة إعلامية'
        }
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <FormField label="العنوان">
            <TextInput
              value={form.title}
              onChange={(event) =>
                updateField('title', event.target.value)
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

          <FormField label="التصنيف">
            <Select
              value={form.category}
              onChange={(event) =>
                updateField('category', event.target.value)
              }
            >
              <option value="news">خبر</option>
              <option value="press">صحافة</option>
              <option value="video">فيديو</option>
              <option value="article">مقال</option>
            </Select>
          </FormField>

          <FormField label="صورة الغلاف">
            <TextInput
              value={form.coverImageUrl}
              onChange={(event) =>
                updateField(
                  'coverImageUrl',
                  event.target.value
                )
              }
              placeholder="رابط الصورة"
            />
          </FormField>

          <FormField label="المختصر">
            <TextArea
              rows={3}
              value={form.excerpt}
              onChange={(event) =>
                updateField('excerpt', event.target.value)
              }
            />
          </FormField>

          <FormField label="المحتوى">
            <TextArea
              rows={8}
              value={form.body}
              onChange={(event) =>
                updateField('body', event.target.value)
              }
            />
          </FormField>

          <FormField label="رابط الفيديو الخارجي">
            <TextInput
              value={form.externalVideoUrl}
              onChange={(event) =>
                updateField(
                  'externalVideoUrl',
                  event.target.value
                )
              }
              placeholder="يُستخدم عند اختيار فيديو"
            />
          </FormField>

          <FormField label="تاريخ النشر">
            <TextInput
              type="datetime-local"
              value={form.publishedAt}
              onChange={(event) =>
                updateField(
                  'publishedAt',
                  event.target.value
                )
              }
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
        title="حذف المادة الإعلامية"
        message={
          deleteTarget
            ? `هل أنت متأكد من حذف "${deleteTarget.title}"؟`
            : ''
        }
        loading={deleting}
      />
    </div>
  )
}