import mongoose from 'mongoose'

const { Schema } = mongoose

const registrationSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    programRef: { type: Schema.Types.ObjectId, ref: 'Program', default: null },
    preferredContactMethod: { type: String, enum: ['whatsapp', 'form'], default: 'form' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'enrolled', 'closed'], default: 'new' },
  },
  { timestamps: true }
)

export default mongoose.model('Registration', registrationSchema)
