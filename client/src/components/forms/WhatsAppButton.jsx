import { FaWhatsapp } from 'react-icons/fa'
import { WHATSAPP_LINK } from '@/lib/constants'

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lift hover:scale-105 transition-transform"
    >
      <FaWhatsapp size={26} />
    </a>
  )
}
