import mongoose from 'mongoose'

const { Schema } = mongoose

const PILLAR_VALUES = ['media', 'mental_health', 'family_counseling', 'education']

const trainerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    specialty: { type: String, default: '' }, // display title, e.g. "مجال الإعلام"
    bio: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    pillars: [{ type: String, enum: PILLAR_VALUES }],
    departmentRefs: { type: [Schema.Types.ObjectId], ref: 'Department', default: [] },
    serviceRefs: { type: [Schema.Types.ObjectId], ref: 'Service', default: [] },
    credentials: [{ type: String }], // left empty until real data is provided
    isPlaceholder: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
)

export default mongoose.model('Trainer', trainerSchema)
