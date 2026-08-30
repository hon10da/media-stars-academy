import mongoose from 'mongoose'

const { Schema } = mongoose

const galleryItemSchema = new Schema(
  {
    title: {
      type: String,
      default: '',
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    showOnHome: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('GalleryItem', galleryItemSchema)