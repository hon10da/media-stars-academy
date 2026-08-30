import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import morgan from 'morgan'

import publicProgramsRoutes from './routes/public/programs.routes.js'
import publicTrainersRoutes from './routes/public/trainers.routes.js'
import publicMediaRoutes from './routes/public/media.routes.js'
import publicTestimonialsRoutes from './routes/public/testimonials.routes.js'
import publicContactRoutes from './routes/public/contact.routes.js'
import publicSettingsRoutes from './routes/public/settings.routes.js'
import publicDepartmentsRoutes from './routes/public/departments.routes.js'
import publicServicesRoutes from './routes/public/services.routes.js'
import publicGalleryRoutes from './routes/public/gallery.routes.js'

import adminAuthRoutes from './routes/admin/auth.routes.js'
import adminProgramsRoutes from './routes/admin/programs.routes.js'
import adminTrainersRoutes from './routes/admin/trainers.routes.js'
import adminMediaRoutes from './routes/admin/media.routes.js'
import adminTestimonialsRoutes from './routes/admin/testimonials.routes.js'
import adminRegistrationsRoutes from './routes/admin/registrations.routes.js'
import adminMessagesRoutes from './routes/admin/messages.routes.js'
import adminSettingsRoutes from './routes/admin/settings.routes.js'
import adminDashboardRoutes from './routes/admin/dashboard.routes.js'
import adminDepartmentsRoutes from './routes/admin/departments.routes.js'
import adminServicesRoutes from './routes/admin/services.routes.js'
import adminGalleryRoutes from './routes/admin/gallery.routes.js'

import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'
import { apiSuccess } from './utils/apiResponse.js'

const app = express()

// Security & parsing middleware
app.use(helmet())
app.use(express.json())
app.use(cookieParser())

// CORS — explicitly whitelisted to the configured frontend origin(s).
// Lesson learned from a prior deployment: SameSite/CORS must be configured
// correctly together for cross-origin cookie-based auth to work.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Health check
app.get('/api/health', (req, res) => apiSuccess(res, { message: 'Media Stars Academy API is running.' }))

// Public routes
app.use('/api/programs', publicProgramsRoutes)
app.use('/api/trainers', publicTrainersRoutes)
app.use('/api/media', publicMediaRoutes)
app.use('/api/testimonials', publicTestimonialsRoutes)
app.use('/api/settings', publicSettingsRoutes)
app.use('/api/departments', publicDepartmentsRoutes)
app.use('/api/gallery', publicGalleryRoutes)
app.use('/api/services', publicServicesRoutes)
app.use('/api', publicContactRoutes) // exposes /api/registrations and /api/contact

// Admin routes
app.use('/api/admin/auth', adminAuthRoutes)
app.use('/api/admin/programs', adminProgramsRoutes)
app.use('/api/admin/trainers', adminTrainersRoutes)
app.use('/api/admin/media', adminMediaRoutes)
app.use('/api/admin/testimonials', adminTestimonialsRoutes)
app.use('/api/admin/registrations', adminRegistrationsRoutes)
app.use('/api/admin/messages', adminMessagesRoutes)
app.use('/api/admin/settings', adminSettingsRoutes)
app.use('/api/admin/dashboard', adminDashboardRoutes)
app.use('/api/admin/departments', adminDepartmentsRoutes)
app.use('/api/admin/services', adminServicesRoutes)
app.use('/api/admin/gallery', adminGalleryRoutes)

// 404 + error handling
app.use(notFoundHandler)
app.use(errorHandler)

export default app
