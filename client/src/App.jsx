import { Routes, Route } from 'react-router-dom'
import { AdminAuthProvider } from '@/context/AdminAuthContext'
import ProtectedRoute from '@/routes/ProtectedRoute'

// Public layout & pages
import MainLayout from '@/components/layout/MainLayout'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Departments from '@/pages/Departments'
import DepartmentDetail from '@/pages/DepartmentDetail'
import ServiceDetail from '@/pages/ServiceDetail'
import Programs from '@/pages/Programs'
import ProgramDetail from '@/pages/ProgramDetail'
import Trainers from '@/pages/Trainers'
import TrainerDetail from '@/pages/TrainerDetail'
import Media from '@/pages/Media'
import ArticleDetail from '@/pages/ArticleDetail'
import Contact from '@/pages/Contact'
import Privacy from '@/pages/Privacy'
import NotFound from '@/pages/NotFound'


// Admin layout & pages
import AdminLayout from '@/components/layout/AdminLayout'
import AdminLogin from '@/pages/admin/AdminLogin'
import Dashboard from '@/pages/admin/Dashboard'
import DepartmentsManager from '@/pages/admin/DepartmentsManager'
import ServicesManager from '@/pages/admin/ServicesManager'
import MediaManager from '@/pages/admin/MediaManager'
import ProgramsManager from '@/pages/admin/ProgramsManager'
import TrainersManager from '@/pages/admin/TrainersManager'
import RegistrationsManager from '@/pages/admin/RegistrationsManager'
import MessagesManager from '@/pages/admin/MessagesManager'
import TestimonialsManager from '@/pages/admin/TestimonialsManager'
import SettingsManager from '@/pages/admin/SettingsManager'
import GalleryManager from '@/pages/admin/GalleryManager'


export default function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Public site */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="departments" element={<Departments />} />
          <Route path="departments/:slug" element={<DepartmentDetail />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programs/:slug" element={<ProgramDetail />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="trainers/:slug" element={<TrainerDetail />} />
          <Route path="media" element={<Media />} />
          <Route path="media/:slug" element={<ArticleDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>

        {/* Admin auth */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="departments" element={<DepartmentsManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="programs" element={<ProgramsManager />} />
            <Route path="trainers" element={<TrainersManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="registrations" element={<RegistrationsManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminAuthProvider>
  )
}
