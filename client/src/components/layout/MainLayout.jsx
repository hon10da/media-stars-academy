import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from '@/components/forms/WhatsAppButton'

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-offwhite">
      <Header />
      <main className="flex-1 pt-[76px] md:pt-[88px]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
