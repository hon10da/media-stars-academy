import { useEffect, useState } from 'react'
import {
  getAdminSettings,
  updateAdminSettings,
} from '@/api/adminSettings.api'

const emptySettings = {
  tagline: '',
  phone: '',
  whatsappNumber: '',
  email: '',
  address: '',
  socialLinks: {
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    x: '',
  },
  homepageStats: [],
}

export default function SettingsManager() {
  const [form, setForm] = useState(emptySettings)
  const [status, setStatus] = useState('loading')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      setStatus('loading')
      setErrorMessage('')

      const res = await getAdminSettings()
      const data = res.data?.data

      if (data) {
        setForm({
          tagline: data.tagline || '',
          phone: data.phone || '',
          whatsappNumber: data.whatsappNumber || '',
          email: data.email || '',
          address: data.address || '',
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            instagram: data.socialLinks?.instagram || '',
            youtube: data.socialLinks?.youtube || '',
            tiktok: data.socialLinks?.tiktok || '',
            x: data.socialLinks?.x || '',
          },
          homepageStats: Array.isArray(data.homepageStats)
            ? data.homepageStats
            : [],
        })
      }

      setStatus('success')
    } catch (err) {
      console.error(err)
      setErrorMessage(
        err?.response?.data?.message ||
          'تعذر تحميل إعدادات الموقع.'
      )
      setStatus('error')
    }
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function updateSocial(field, value) {
    setForm((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [field]: value,
      },
    }))
  }

  function addStat() {
    setForm((current) => ({
      ...current,
      homepageStats: [
        ...current.homepageStats,
        {
          label: '',
        },
      ],
    }))
  }

  function updateStat(index, value) {
    setForm((current) => ({
      ...current,
      homepageStats: current.homepageStats.map((stat, i) =>
        i === index
          ? {
              ...stat,
              label: value,
            }
          : stat
      ),
    }))
  }

  function removeStat(index) {
    setForm((current) => ({
      ...current,
      homepageStats: current.homepageStats.filter(
        (_, i) => i !== index
      ),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSaving(true)
      setMessage('')
      setErrorMessage('')

      const res = await updateAdminSettings(form)

      const data = res.data?.data

      if (data) {
        setForm({
          tagline: data.tagline || '',
          phone: data.phone || '',
          whatsappNumber: data.whatsappNumber || '',
          email: data.email || '',
          address: data.address || '',
          socialLinks: {
            facebook: data.socialLinks?.facebook || '',
            instagram: data.socialLinks?.instagram || '',
            youtube: data.socialLinks?.youtube || '',
            tiktok: data.socialLinks?.tiktok || '',
            x: data.socialLinks?.x || '',
          },
          homepageStats: Array.isArray(data.homepageStats)
            ? data.homepageStats
            : [],
        })
      }

      setMessage('تم حفظ إعدادات الموقع بنجاح.')
    } catch (err) {
      console.error(err)

      setErrorMessage(
        err?.response?.data?.message ||
          'تعذر حفظ إعدادات الموقع.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 border-4 border-navy/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-navy mb-4">
          إعدادات الموقع
        </h1>

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
          {errorMessage}
        </div>

        <button
          onClick={loadSettings}
          className="mt-4 px-5 py-2.5 rounded-lg bg-navy text-white font-bold"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy">
          إعدادات الموقع
        </h1>

        <p className="text-muted text-sm mt-1">
          تعديل بيانات التواصل والروابط ومعلومات الصفحة الرئيسية.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 font-bold">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 font-bold">
            {errorMessage}
          </div>
        )}

        {/* General information */}
        <section className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="font-bold text-lg text-navy mb-5">
            البيانات الأساسية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="الجملة التعريفية"
              value={form.tagline}
              onChange={(value) =>
                updateField('tagline', value)
              }
              full
            />

            <Field
              label="رقم الهاتف"
              value={form.phone}
              onChange={(value) =>
                updateField('phone', value)
              }
            />

            <Field
              label="رقم واتساب"
              value={form.whatsappNumber}
              onChange={(value) =>
                updateField('whatsappNumber', value)
              }
            />

            <Field
              label="البريد الإلكتروني"
              type="email"
              value={form.email}
              onChange={(value) =>
                updateField('email', value)
              }
            />

            <Field
              label="العنوان"
              value={form.address}
              onChange={(value) =>
                updateField('address', value)
              }
              full
            />
          </div>
        </section>

        {/* Social links */}
        <section className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="font-bold text-lg text-navy mb-5">
            روابط التواصل الاجتماعي
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Facebook"
              value={form.socialLinks.facebook}
              onChange={(value) =>
                updateSocial('facebook', value)
              }
            />

            <Field
              label="Instagram"
              value={form.socialLinks.instagram}
              onChange={(value) =>
                updateSocial('instagram', value)
              }
            />

            <Field
              label="YouTube"
              value={form.socialLinks.youtube}
              onChange={(value) =>
                updateSocial('youtube', value)
              }
            />

            <Field
              label="TikTok"
              value={form.socialLinks.tiktok}
              onChange={(value) =>
                updateSocial('tiktok', value)
              }
            />

            <Field
              label="X"
              value={form.socialLinks.x}
              onChange={(value) =>
                updateSocial('x', value)
              }
            />
          </div>
        </section>

        {/* Homepage stats */}
        <section className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-lg text-navy">
                إحصائيات الصفحة الرئيسية
              </h2>

              <p className="text-muted text-xs mt-1">
                أضف العبارات التي تريد عرضها في الصفحة الرئيسية.
              </p>
            </div>

            <button
              type="button"
              onClick={addStat}
              className="px-4 py-2 rounded-lg bg-navy text-white font-bold text-sm"
            >
              + إضافة
            </button>
          </div>

          {form.homepageStats.length === 0 ? (
            <p className="text-center text-muted py-8">
              لا توجد إحصائيات حاليًا.
            </p>
          ) : (
            <div className="space-y-3">
              {form.homepageStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-center"
                >
                  <input
                    type="text"
                    value={stat.label || ''}
                    onChange={(event) =>
                      updateStat(
                        index,
                        event.target.value
                      )
                    }
                    placeholder="مثال: أكثر من 1000 متدرب"
                    className="flex-1 border border-navy/10 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30"
                  />

                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="px-4 py-3 rounded-lg bg-red-50 text-red-600 font-bold"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-lg bg-[var(--color-gold)] text-navy font-bold disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  full = false,
}) {
  return (
    <label
      className={
        full ? 'md:col-span-2 block' : 'block'
      }
    >
      <span className="block text-sm font-bold text-navy mb-2">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full border border-navy/10 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30"
      />
    </label>
  )
}