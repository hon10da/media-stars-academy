import mongoose from 'mongoose'

const { Schema } = mongoose

const PROGRAM_PILLARS = ['media', 'mental_health', 'family_counseling', 'education']

const programSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    pillar: { type: String, enum: PROGRAM_PILLARS, required: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    duration: { type: String, default: '' },
    level: { type: String, default: '' },
    coverImageUrl: { type: String, default: '' },
    trainerRef: { type: Schema.Types.ObjectId, ref: 'Trainer', default: null },
    departmentRef: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    serviceRefs: { type: [Schema.Types.ObjectId], ref: 'Service', default: [] },
    isFeatured: { type: Boolean, default: false },
    isPlaceholder: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
)

export const PROGRAM_PILLAR_VALUES = PROGRAM_PILLARS
export default mongoose.model('Program', programSchema)
