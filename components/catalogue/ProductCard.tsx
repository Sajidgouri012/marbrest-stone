'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Heart, Play } from 'lucide-react'
import Link from 'next/link'

export interface CatalogueProduct {
  id: string
  name: string
  description: string
  image_url: string
  images?: string[]
  video_url?: string | null
  product_category_id: string
  product_category?: {
    id: string
    name: string
    slug: string
    description: string
    display_order: number
    visible: boolean
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
  display_order?: number
  created_at: string
}

interface ProductCardProps {
  product: CatalogueProduct
  index: number
  isInShortlist: boolean
  onToggleShortlist: (product: CatalogueProduct) => void
  onQuote: (productName: string) => void
  /** compact = catalogue grid (4:3 image), full = category page (more info) */
  variant?: 'compact' | 'full'
  onCategoryClick?: (slug: string) => void
}

export default function ProductCard({
  product,
  index,
  isInShortlist,
  onToggleShortlist,
  onQuote,
  variant = 'compact',
  onCategoryClick,
}: ProductCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const router = useRouter()

  const categoryName = product.product_category?.name ?? ''
  const categorySlug = product.product_category?.slug ?? ''

  const finishKeywords = ['polished', 'honed', 'brushed', 'sand-blasted', 'matte', 'glossy', 'finish']
  const finishPills = product.features.filter((f) =>
    finishKeywords.some((k) => f.toLowerCase().includes(k))
  )
  const displayFinishes = finishPills.length > 0 ? finishPills.slice(0, 3) : []

  const dimensions = product.features.find((f) =>
    ['size', 'dimension', 'cm', 'mm', 'inch', 'ft', 'custom size'].some((k) => f.toLowerCase().includes(k))
  ) ?? 'Custom sizes available'

  const isExportReady = product.features.some((f) =>
    ['export', 'bulk', 'international'].some((k) => f.toLowerCase().includes(k))
  )

  /* Where the card navigates on click:
     - full variant  → product detail page
     - compact variant → catalogue category page */
  const cardHref = categorySlug
    ? variant === 'full'
      ? `/products/${categorySlug}/${product.id}`
      : `/catalogue/${categorySlug}`
    : null

  /* Arrow button destination — same as card click */
  const arrowHref = cardHref

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      onClick={() => cardHref && router.push(cardHref)}
      className="group relative bg-white border border-gray-200 hover:border-[#B8962E] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 flex-shrink-0 aspect-[4/3]">
        <img
          src={product.image_url}
          alt={`${product.name} — ${product.origin} marble by Marbrest Stone`}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          loading="lazy"
        />

        {/* Category badge — top left */}
        {categoryName && (
          <button
            onClick={(e) => { e.stopPropagation(); onCategoryClick?.(categorySlug) }}
            className="absolute top-2 left-2 bg-[#1A1A1A]/80 backdrop-blur-sm px-2 py-0.5 rounded text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-[#B8962E] transition-colors"
          >
            {categoryName}
          </button>
        )}

        {/* Video badge — bottom left */}
        {product.video_url && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
            <Play size={8} fill="currentColor" />
            Video
          </div>
        )}

        {/* Top right: CUSTOM badge + heart */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {product.customizable && (
            <span className="bg-[#B8962E] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
              CUSTOM
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleShortlist(product) }}
            className={`w-7 h-7 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 shadow-sm ${
              isInShortlist
                ? 'bg-[#B8962E] text-white'
                : 'bg-white/90 text-gray-400 hover:text-[#B8962E]'
            }`}
            aria-label={isInShortlist ? 'Remove from shortlist' : 'Add to shortlist'}
            title={isInShortlist ? 'Remove from shortlist' : 'Save to shortlist'}
          >
            <Heart size={14} fill={isInShortlist ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-charcoal text-sm mb-1 line-clamp-2 group-hover:text-[#B8962E] transition-colors leading-snug">
          {product.name}
        </h3>

        <p className="text-[11px] text-gray-500 mb-2">
          {product.origin}
          {categoryName && ` · ${categoryName}`}
        </p>

        {/* Finish pills */}
        {displayFinishes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {displayFinishes.map((f) => (
              <span key={f} className="text-[9px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full uppercase tracking-wide">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Extra info for full variant */}
        {variant === 'full' && (
          <div className="space-y-1 mb-3">
            <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed">{product.description}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
              <span>📐 {dimensions}</span>
              {isExportReady && <span className="text-[#B8962E] font-semibold">✓ Export Ready</span>}
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => { e.stopPropagation(); onQuote(product.name) }}
            className="flex-1 py-2 text-[11px] font-semibold bg-[#B8962E] text-white hover:bg-[#9A7D25] transition-colors"
          >
            Quick Quote
          </button>
          {arrowHref ? (
            <Link
              href={arrowHref}
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-2 text-[11px] font-semibold border border-gray-300 text-gray-700 hover:border-[#B8962E] hover:text-[#B8962E] transition-colors flex items-center"
              title={variant === 'full' ? 'View product details' : `View all ${categoryName}`}
            >
              ↗
            </Link>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onQuote(product.name) }}
              className="px-3 py-2 text-[11px] font-semibold border border-gray-300 text-gray-700 hover:border-[#B8962E] hover:text-[#B8962E] transition-colors"
            >
              ↗
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
