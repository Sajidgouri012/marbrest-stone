'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, MessageCircle, FileText } from 'lucide-react'

type PriceType = 'fixed' | 'range' | 'quote'

interface ProductPriceProps {
  priceType: PriceType
  basePrice?: number | null
  minPrice?: number | null
  maxPrice?: number | null
  priceUnit?: string
  whatsappLink?: string | null
  productName: string
  onRequestQuote?: () => void
  onAddToCart?: () => void
}

export default function ProductPrice({
  priceType,
  basePrice,
  minPrice,
  maxPrice,
  priceUnit = 'per sq ft',
  whatsappLink,
  productName,
  onRequestQuote,
  onAddToCart,
}: ProductPriceProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleWhatsApp = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Price Display */}
      <div className="border-t border-gray-200 pt-6">
        {priceType === 'fixed' && basePrice && (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-charcoal">
                {formatPrice(basePrice)}
              </span>
              <span className="text-sm text-gray-500">{priceUnit}</span>
            </div>
            <p className="text-xs text-gray-500">Inclusive of all taxes</p>
          </div>
        )}

        {priceType === 'range' && minPrice && (
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-gray-600 font-medium">Starting from</p>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-serif font-bold text-charcoal">
                  {formatPrice(minPrice)}
                </span>
                <span className="text-sm text-gray-500">{priceUnit}</span>
              </div>
            </div>
            <div className="bg-gold/10 border border-gold/30 px-4 py-3 rounded">
              <p className="text-xs text-charcoal leading-relaxed">
                <span className="font-semibold">Note:</span> Final price depends on size, finish & customization options
              </p>
            </div>
          </div>
        )}

        {priceType === 'quote' && (
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-charcoal text-white rounded-full">
              <FileText size={16} />
              <span className="text-sm font-semibold tracking-wide">CUSTOM MADE</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              This is a fully customizable product. Get a personalized quote based on your specific requirements.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        {priceType === 'fixed' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddToCart}
            className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gold text-charcoal font-semibold tracking-wide hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={20} />
            <span>ADD TO CART</span>
          </motion.button>
        )}

        {(priceType === 'range' || priceType === 'quote') && (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRequestQuote}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-charcoal text-white font-semibold tracking-wide hover:bg-charcoal/90 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FileText size={20} />
              <span>REQUEST A QUOTE</span>
            </motion.button>

            {whatsappLink && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 border-2 border-green-600 text-green-600 font-semibold tracking-wide hover:bg-green-50 transition-all duration-300"
              >
                <MessageCircle size={20} />
                <span>WHATSAPP FOR DETAILS</span>
              </motion.button>
            )}
          </>
        )}
      </div>

      {/* Additional Info for Range Pricing */}
      {priceType === 'range' && maxPrice && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Price range: {formatPrice(minPrice || 0)} - {formatPrice(maxPrice)}
          </p>
        </div>
      )}
    </motion.div>
  )
}
