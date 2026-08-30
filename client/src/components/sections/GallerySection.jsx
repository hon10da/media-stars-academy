import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '@/api/axiosClient'

export default function GallerySection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const response = await axiosClient.get('/gallery?home=true')
        setItems(response.data?.data || [])
      } catch (error) {
        console.error('Failed to load gallery:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGallery()
  }, [])

  if (loading || items.length === 0) {
    return null
  }

  return (
    <>
      <section className="py-16 md:py-20 bg-offwhite">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-[var(--color-gold)] font-bold text-sm mb-2">
              معرض الأكاديمية
            </p>

            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">
              من داخل Media Stars Academy
            </h2>

            <p className="text-muted max-w-2xl mx-auto">
              لمحات من أجواء الأكاديمية والتدريب والأنشطة.
            </p>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedImage(item)}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-navy/5 shadow-soft cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'صورة من الأكاديمية'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {(item.title || item.description) && (
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                    {item.title && (
                      <h3 className="font-bold text-sm">
                        {item.title}
                      </h3>
                    )}

                    {item.description && (
                      <p className="text-xs text-white/80 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* More button */}
          <div className="text-center mt-8">
            <Link
              to="/media"
              className="inline-flex items-center justify-center rounded-lg gold-gradient text-navy font-bold px-6 py-3 hover:opacity-90 transition-opacity"
            >
              شاهد المزيد
            </Link>
          </div>

        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title || 'صورة من الأكاديمية'}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-white text-navy text-2xl font-bold shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="إغلاق"
            >
              ×
            </button>

            {/* Image info */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="mt-3 text-center text-white">
                {selectedImage.title && (
                  <h3 className="font-bold text-lg">
                    {selectedImage.title}
                  </h3>
                )}

                {selectedImage.description && (
                  <p className="text-sm text-white/80 mt-1">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}