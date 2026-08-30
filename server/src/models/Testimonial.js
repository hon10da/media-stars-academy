import mongoose from 'mongoose'

const { Schema } = mongoose

const testimonialSchema = new Schema(
  {
    studentName: { type: String, required: true, trim: true },
    role: { type: String, default: '' }, // e.g. program name or general role
    quote: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, default: null },
    isPlaceholder: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Testimonial', testimonialSchema)
