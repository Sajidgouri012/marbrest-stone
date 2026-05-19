'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, Heart, ChevronLeft } from 'lucide-react'
import QuoteModal from '@/components/catalogue/QuoteModal'

interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  display_order: number
  visible: boolean
}

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  images?: string[]
  video_url?: string | null
  product_category_id: string
  product_category?: ProductCategory
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

interface RelatedProduct {
  id: string
  name: string
  image_url: string
  origin: string
  features: string[]
  product_category_id: string
  product_category?: ProductCategory
}

interface Props {
  product: Product
  categorySlug: string
  relatedProducts: RelatedProduct[]
}

const FINISH_KEYWORDS = ['polished', 'honed', 'brushed', 'sand-blasted', 'matte', 'glossy', 'finish']

export default function ProductDetailClient({ product, categorySlug, relatedProducts }: Props) {
  const allImages = [product.image_url, ...(product.images ?? [])].filter(Boolean)
  const [activeImg, setActiveImg] = useState(0)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [inShortlist, setInShortlist] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const saved = JSON.parse(localStorage.getItem('marbrest_shortlist') || '[]')
      return saved.some((p: any) => p.id === product.id)
    } catch { return false }
  })

  const toggleShortlist = useCallback(() => {
    setInShortlist((prev: boolean) => {
      const saved: Product[] = (() => {
        try { return JSON.parse(localStorage.getItem('marbrest_shortlist') || '[]') } catch { return [] }
      })()
      const next = prev
        ? saved.filter((p) => p.id !== product.id)
        : [...saved, product]
      try { localStorage.setItem('marbrest_shortlist', JSON.stringify(next)) } catch {}
      return !prev
    })
  }, [product])

  const finishPills = product.features.filter((f) =>
    FINISH_KEYWORDS.some((k) => f.toLowerCase().includes(k))
  )
  const otherFeatures = product.features.filter((f) =>
    !FINISH_KEYWORDS.some((k) => f.toLowerCase().includes(k))
  )

  const categoryName = product.product_category?.name ?? ''
  const waMsg = `Hi Marbrest Stone! I'm interested in the product "${product.name}" (${product.origin}). Please share more details on pricing and availability.`
  const waHref = product.whatsapp_link ?? `https://wa.me/918000485312?text=${encodeURIComponent(waMsg)}`

  const prevImg = () => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length)
  const nextImg = () => setActiveImg((i) => (i + 1) % allImages.length)

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-gray-500 flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#B8962E] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-[#B8962E] transition-colors">Products</Link>
            <ChevronRight size={12} />
            <Link href={`/products/${categorySlug}`} className="hover:text-[#B8962E] transition-colors">
              {categoryName || categorySlug}
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#B8962E] font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

          {/* ── Image gallery ── */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3">
              <motion.img
                key={activeImg}
                src={allImages[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />

              {/* Nav arrows (only if multiple images) */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white shadow flex items-center justify-center transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white shadow flex items-center justify-center transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Shortlist button */}
              <button
                onClick={toggleShortlist}
                className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full shadow backdrop-blur-sm transition-all ${
                  inShortlist ? 'bg-[#B8962E] text-white' : 'bg-white/90 text-gray-400 hover:text-[#B8962E]'
                }`}
                aria-label={inShortlist ? 'Remove from shortlist' : 'Save to shortlist'}
              >
                <Heart size={16} fill={inShortlist ? 'currentColor' : 'none'} />
              </button>

              {/* Image counter */}
              {allImages.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full">
                  {activeImg + 1} / {allImages.length}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-all ${
                      i === activeImg ? 'border-[#B8962E]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="flex flex-col">
            {/* Category + customizable badge */}
            <div className="flex items-center gap-2 mb-3">
              {categoryName && (
                <Link
                  href={`/products/${categorySlug}`}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#B8962E] hover:underline"
                >
                  {categoryName}
                </Link>
              )}
              {product.customizable && (
                <span className="bg-[#B8962E] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide">
                  CUSTOMIZABLE
                </span>
              )}
            </div>

            <h1 className="font-serif font-bold text-charcoal text-2xl sm:text-3xl leading-snug mb-2">
              {product.name}
            </h1>

            <p className="text-sm text-gray-500 mb-4">
              Origin: <span className="font-semibold text-charcoal">{product.origin}</span>
            </p>

            {/* Finish pills */}
            {finishPills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {finishPills.map((f) => (
                  <span
                    key={f}
                    className="text-[11px] font-semibold px-2.5 py-1 bg-[#B8962E]/10 text-[#B8962E] uppercase tracking-wide"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Features list */}
            {otherFeatures.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">Features & Specifications</p>
                <ul className="space-y-1.5">
                  {otherFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#B8962E] mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="h-px bg-gray-200 my-5" />

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { icon: '🚢', label: 'Export Ready', sub: '30+ countries' },
                { icon: '⏱', label: 'Lead Time', sub: '3–6 weeks typical' },
                { icon: '✂️', label: 'Custom Sizes', sub: 'On request' },
                { icon: '🏅', label: 'Heritage Craft', sub: '30+ years' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex items-start gap-2 text-sm">
                  <span className="text-lg leading-none mt-0.5">{icon}</span>
                  <div>
                    <p className="font-semibold text-charcoal text-xs">{label}</p>
                    <p className="text-gray-500 text-[11px]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setQuoteOpen(true)}
                className="flex-1 py-3.5 bg-[#B8962E] text-white font-semibold hover:bg-[#9A7D25] transition-colors"
              >
                Request a Quote
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-[#25D366] text-white font-semibold hover:bg-[#1daa54] transition-colors flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            <button
              onClick={toggleShortlist}
              className={`mt-3 py-2.5 text-sm font-semibold border transition-colors flex items-center justify-center gap-2 ${
                inShortlist
                  ? 'border-[#B8962E] text-[#B8962E] bg-[#B8962E]/5'
                  : 'border-gray-300 text-gray-600 hover:border-[#B8962E] hover:text-[#B8962E]'
              }`}
            >
              <Heart size={14} fill={inShortlist ? 'currentColor' : 'none'} />
              {inShortlist ? 'Saved to Shortlist' : 'Save to Shortlist'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Related products ── */}
      {relatedProducts.length > 0 && (
        <section className="py-14 px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-serif font-bold text-charcoal mb-2">
              More from {categoryName}
            </h2>
            <div className="h-0.5 w-12 bg-[#B8962E] mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => {
                const rpSlug = rp.product_category?.slug ?? categorySlug
                return (
                  <Link
                    key={rp.id}
                    href={`/products/${rpSlug}/${rp.id}`}
                    className="group border border-gray-200 hover:border-[#B8962E] hover:shadow-md transition-all duration-300 bg-white overflow-hidden"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={rp.image_url}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-charcoal line-clamp-2 group-hover:text-[#B8962E] transition-colors leading-snug">
                        {rp.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">{rp.origin}</p>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                href={`/products/${categorySlug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8962E] hover:gap-3 transition-all duration-200"
              >
                View all {categoryName}
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        prefilledProduct={product.name}
      />
    </div>
  )
}
