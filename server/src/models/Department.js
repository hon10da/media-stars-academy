import mongoose from 'mongoose'

const { Schema } = mongoose

const departmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isPlaceholder: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
)

export default mongoose.model('Department', departmentSchema)