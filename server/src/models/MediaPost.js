import mongoose from 'mongoose'

const { Schema } = mongoose

const mediaPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, default: '' },
    body: { type: String, default: '' },
    coverImageUrl: { type: String, default: '' },
    category: { type: String, enum: ['news', 'press', 'video', 'article'], default: 'news' },
    externalVideoUrl: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now },
    isPlaceholder: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
)

export default mongoose.model('MediaPost', mediaPostSchema)
