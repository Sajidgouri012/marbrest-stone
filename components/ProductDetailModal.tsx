'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductPrice from './ProductPrice'
import QuoteRequestModal from './QuoteRequestModal'

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  images?: string[]
  video_url?: string
  product_category_id: string
  product_category?: {
    id: string
    name: string
  }
  origin: string
  features: string[]
  customizable: boolean
  visible: boolean
  price_type: 'fixed' | 'range' | 'quote'
  base_price?: number | null
  min_price?: number | null
  max_price?: number | null
  price_unit?: string
  whatsapp_link?: string | null
}

interface ProductDetailModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose
}: ProductDetailModalProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null)
  const [isPlayingVideoInFullscreen, setIsPlayingVideoInFullscreen] = useState(false)

  // Build gallery: combine main image + additional images (if any)
  const buildImageGallery = () => {
    const gallery: string[] = []
    
    // Always include main image first
    if (product.image_url) {
      gallery.push(product.image_url)
    }
    
    // Add additional images if they exist (up to 5 total)
    if (product.images && product.images.length > 0) {
      // Filter out empty strings and the main image if it's duplicated
      const additionalImages = product.images
        .filter(img => img && img.trim() !== '' && img !== product.image_url)
        .slice(0, 4) // Max 4 additional (5 total with main)
      
      gallery.push(...additionalImages)
    }
    
    return gallery
  }

  const images = buildImageGallery()
  const hasVideo = !!product.video_url
  const isLastImage = selectedImageIndex === images.length - 1

  const handleAddToCart = () => {
    alert('Add to cart functionality coming soon!')
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    return url
  }

  const handlePlayVideo = () => {
    setIsPlayingVideo(true)
  }

  const handleCloseVideo = () => {
    setIsPlayingVideo(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-screen px-4 py-8 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-charcoal" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Left Side - Image Gallery with Video */}
              <div className="space-y-4">
                {isPlayingVideo && product.video_url ? (
                  /* Video Player - replaces main image only */
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <iframe
                      src={getVideoEmbedUrl(product.video_url)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                      allowFullScreen
                      title={`${product.name} video`}
                    />
                    
                    {/* Close Video Button */}
                    <button
                      onClick={handleCloseVideo}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors z-10"
                      title="Close video"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  /* Main Image */
                  <>
                    {/* Main Image */}
                    <div 
                      className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer"
                      onClick={() => setSelectedImageForModal(images[selectedImageIndex])}
                    >
                      <img
                        src={images[selectedImageIndex]}
                        alt={`${product.name} — ${product.origin} marble by Marbrest Stone`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      
                      {product.customizable && (
                        <div className="absolute top-4 right-4 bg-gold px-3 py-1.5 rounded-full">
                          <span className="text-charcoal text-xs font-bold">CUSTOMIZABLE</span>
                        </div>
                      )}

                      {/* Show video play button only on last image if video exists */}
                      {hasVideo && isLastImage && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlayVideo()
                          }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-charcoal p-4 rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                          <Play size={32} fill="currentColor" />
                        </button>
                      )}

                      {/* Video badge on last image */}
                      {hasVideo && isLastImage && (
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <Play size={14} className="text-white" fill="white" />
                          <span className="text-white text-xs font-medium">VIDEO</span>
                        </div>
                      )}

                      {/* Navigation Arrows (if multiple images or video) */}
                      {(images.length > 1 || hasVideo) && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              prevImage()
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                          >
                            <ChevronLeft size={24} className="text-charcoal" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              nextImage()
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                          >
                            <ChevronRight size={24} className="text-charcoal" />
                          </button>
                        </>
                      )}
                    </div>

                  </>
                )}

                {/* Thumbnail Gallery - Always visible (if multiple images or video) */}
                {(images.length > 1 || hasVideo) && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, idx) => {
                      const isLastThumb = idx === images.length - 1
                      const showVideoIcon = hasVideo && isLastThumb
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedImageIndex(idx)
                            if (isPlayingVideo) {
                              setIsPlayingVideo(false)
                            }
                          }}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === idx && !isPlayingVideo
                              ? 'border-gold'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} view ${idx + 1} — Marbrest Stone`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {showVideoIcon && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play size={20} className="text-white" fill="white" />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Right Side - Product Details */}
              <div className="flex flex-col">
                <div className="flex-1 space-y-6">
                  {/* Product Title & Origin */}
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal mb-2">
                      {product.name}
                    </h1>
                    <p className="text-gold font-medium text-lg">{product.origin}</p>
                    {product.product_category && (
                      <p className="text-gray-600 text-sm mt-1">
                        Category: <span className="font-semibold">{product.product_category.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-charcoal mb-3">Key Features</h3>
                      <div className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <Check className="text-gold flex-shrink-0 mt-0.5" size={18} />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customization Note */}
                  {product.customizable && (
                    <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                      <p className="text-sm text-charcoal">
                        <span className="font-semibold">✨ Fully Customizable:</span> This product can be tailored to your exact specifications including size, finish, and design.
                      </p>
                    </div>
                  )}
                </div>

                {/* Pricing & Actions - Sticky at bottom */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <ProductPrice
                    priceType={product.price_type}
                    basePrice={product.base_price}
                    minPrice={product.min_price}
                    maxPrice={product.max_price}
                    priceUnit={product.price_unit}
                    whatsappLink={product.whatsapp_link}
                    productName={product.name}
                    onRequestQuote={() => setShowQuoteModal(true)}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quote Request Modal */}
        {showQuoteModal && (
          <QuoteRequestModal
            isOpen={showQuoteModal}
            onClose={() => setShowQuoteModal(false)}
            productId={product.id}
            productName={product.name}
          />
        )}

        {/* Fullscreen Image/Video Modal */}
        {selectedImageForModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
            onClick={(e) => {
              e.stopPropagation()
              if (!isPlayingVideoInFullscreen) {
                setSelectedImageForModal(null)
              }
            }}
          >
            {isPlayingVideoInFullscreen && product.video_url ? (
              /* Fullscreen Video Player */
              <div 
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-full max-w-7xl aspect-video">
                  <iframe
                    src={getVideoEmbedUrl(product.video_url)}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title={`${product.name} video`}
                  />
                  
                  {/* Close Video Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPlayingVideoInFullscreen(false)
                      setSelectedImageForModal(null)
                    }}
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors z-10"
                    title="Close video"
                  >
                    <X size={24} />
                  </button>

                  {/* Minimize Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPlayingVideoInFullscreen(false)
                      setSelectedImageForModal(null)
                      setIsPlayingVideo(true)
                    }}
                    className="absolute top-4 right-20 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-full transition-colors z-10 text-sm font-medium"
                    title="Minimize to product view"
                  >
                    Minimize
                  </button>
                </div>
              </div>
            ) : (
              /* Fullscreen Image View */
              <>
                {/* Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageForModal(null)
                  }}
                  className="absolute top-4 right-4 text-white hover:text-gold transition-colors z-10"
                >
                  <X size={32} />
                </button>

                {/* Navigation Arrows */}
                {(images.length > 1 || hasVideo) && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const newIndex = selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
                        setSelectedImageIndex(newIndex)
                        setSelectedImageForModal(images[newIndex])
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors z-10"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const newIndex = selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
                        setSelectedImageIndex(newIndex)
                        setSelectedImageForModal(images[newIndex])
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors z-10"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}

                {/* Video Play Button (if on last image and has video) */}
                {hasVideo && selectedImageIndex === images.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPlayingVideoInFullscreen(true)
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-charcoal p-6 rounded-full hover:scale-110 transition-transform shadow-2xl z-10"
                  >
                    <Play size={40} fill="currentColor" />
                  </button>
                )}
                
                <div 
                  className="relative flex items-center justify-center w-full h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.img
                    key={selectedImageForModal}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={selectedImageForModal}
                    alt={product.name}
                    className="max-w-full max-h-[calc(100vh-8rem)] object-contain"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 to-transparent p-4 rounded">
                    <h3 className="text-white text-xl md:text-2xl font-serif font-bold">
                      {product.name}
                      {hasVideo && selectedImageIndex === images.length - 1 && (
                        <span className="ml-3 text-sm text-gold">• Video Available</span>
                      )}
                    </h3>
                    <p className="text-white/80 text-sm mt-1">
                      Image {selectedImageIndex + 1} of {images.length}
                      {hasVideo && selectedImageIndex === images.length - 1 && ' • Click play to watch video'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
