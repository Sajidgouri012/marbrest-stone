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
  stone_type_id: string
  stone_type?: {
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
  onVideoClick?: (url: string) => void
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onVideoClick
}: ProductDetailModalProps) {
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

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

  const handleAddToCart = () => {
    alert('Add to cart functionality coming soon!')
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
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
              {/* Left Side - Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {product.customizable && (
                    <div className="absolute top-4 right-4 bg-gold px-3 py-1.5 rounded-full">
                      <span className="text-charcoal text-xs font-bold">CUSTOMIZABLE</span>
                    </div>
                  )}

                  {product.video_url && (
                    <button
                      onClick={() => onVideoClick?.(product.video_url!)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-charcoal p-4 rounded-full hover:scale-110 transition-transform shadow-lg"
                    >
                      <Play size={32} fill="currentColor" />
                    </button>
                  )}

                  {/* Navigation Arrows (if multiple images) */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronLeft size={24} className="text-charcoal" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <ChevronRight size={24} className="text-charcoal" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Gallery (if multiple images) */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-gold'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
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
                    {product.stone_type && (
                      <p className="text-gray-600 text-sm mt-1">
                        Category: <span className="font-semibold">{product.stone_type.name}</span>
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
      </motion.div>
    </AnimatePresence>
  )
}
