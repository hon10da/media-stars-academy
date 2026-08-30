import mongoose from 'mongoose'

const { Schema } = mongoose

const serviceSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    departmentRef: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isPlaceholder: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
)

export default mongoose.model('Service', serviceSchema)