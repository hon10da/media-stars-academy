import mongoose from 'mongoose'

const { Schema } = mongoose

const contactMessageSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  },
  { timestamps: true }
)

export default mongoose.model('ContactMessage', contactMessageSchema)
