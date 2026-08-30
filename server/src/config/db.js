import mongoose from 'mongoose'

// Fail fast instead of silently buffering queries when there is no active
// connection yet — buffering is what produced the exact
// "Operation `x.find()` buffering timed out after 10000ms" error on Vercel.
mongoose.set('bufferCommands', false)

// Serverless-safe connection cache. A Vercel serverless function's module
// scope can be reused across "warm" invocations of the same instance, so we
// cache the connection promise here instead of calling mongoose.connect()
// on every request — this avoids reconnecting per-request and avoids
// exhausting MongoDB Atlas's connection limit under serverless load.
let cachedConnectionPromise = null

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error(' MONGODB_URI is not defined in environment variables.')
    throw new Error('MONGODB_URI is not defined in environment variables.')
  }

  // Already connected (e.g. a warm serverless invocation, or local dev
  // after the initial boot connection) — nothing to do.
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  // A connection attempt is already in flight — reuse the same promise
  // instead of starting a second, competing connection attempt.
  if (cachedConnectionPromise) {
    return cachedConnectionPromise
  }

  console.log('MongoDB: attempting connection...')

  cachedConnectionPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 10000,
    })
    .then((conn) => {
      console.log(' MongoDB connected successfully')
      console.log('MongoDB readyState:', mongoose.connection.readyState)
      return conn
    })
    .catch((error) => {
      // Allow the next request/invocation to retry instead of being stuck
      // forever on a rejected cached promise.
      cachedConnectionPromise = null
      console.error(' MongoDB connection failed:', error.message)
      throw error
    })

  return cachedConnectionPromise
}