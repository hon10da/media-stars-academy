import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('MONGODB_URI is not defined')
    throw new Error('MONGODB_URI is not defined')
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })

    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    throw error
  }
}