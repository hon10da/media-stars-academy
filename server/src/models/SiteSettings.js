import mongoose from 'mongoose'

const { Schema } = mongoose

const socialLinksSchema = new Schema(
  {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    x: { type: String, default: '' },
  },
  { _id: false }
)

const homepageStatSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
)

const siteSettingsSchema = new Schema(
  {
    // Enforced singleton via a fixed key — see seed script / service layer.
    key: { type: String, default: 'main', unique: true },
    tagline: { type: String, default: 'نصنع نجوم الإعلام... ونبني أجيالاً واعية' },
    phone: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
    homepageStats: { type: [homepageStatSchema], default: [] }, // left empty until real numbers exist
  },
  { timestamps: true }
)

export default mongoose.model('SiteSettings', siteSettingsSchema)
