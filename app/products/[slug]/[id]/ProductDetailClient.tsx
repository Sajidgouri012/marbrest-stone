'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, Heart, ChevronLeft, Play, X, ZoomIn } from 'lucide-react'
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

type MediaItem = { type: 'image'; url: string } | { type: 'video'; url: string }

const FINISH_KEYWORDS = ['polished', 'honed', 'brushed', 'sand-blasted', 'matte', 'glossy', 'finish']

function getVideoEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`
  return null // direct file — handled by <video> tag
}

function getYoutubeThumbnail(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`
  return null
}

export default function ProductDetailClient({ product, categorySlug, relatedProducts }: Props) {
  const allImages = [product.image_url, ...(product.images ?? [])].filter(Boolean)
  const mediaItems: MediaItem[] = [
    ...allImages.map((url) => ({ type: 'image' as const, url })),
    ...(product.video_url ? [{ type: 'video' as const, url: product.video_url }] : []),
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [inShortlist, setInShortlist] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const saved = JSON.parse(localStorage.getItem('marbrest_shortlist') || '[]')
      return saved.some((p: any) => p.id === product.id)
    } catch { return false }
  })

  const activeItem = mediaItems[activeIndex]

  /* Close lightbox on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (lightboxOpen) {
        if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length)
        if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % allImages.length)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxOpen, allImages.length])

  /* Lock scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

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

  const prevMedia = () => setActiveIndex((i) => (i - 1 + mediaItems.length) % mediaItems.length)
  const nextMedia = () => setActiveIndex((i) => (i + 1) % mediaItems.length)

  const finishPills = product.features.filter((f) =>
    FINISH_KEYWORDS.some((k) => f.toLowerCase().includes(k))
  )
  const otherFeatures = product.features.filter((f) =>
    !FINISH_KEYWORDS.some((k) => f.toLowerCase().includes(k))
  )

  const categoryName = product.product_category?.name ?? ''
  const waMsg = `Hi Marbrest Stone! I'm interested in the product "${product.name}" (${product.origin}). Please share more details on pricing and availability.`
  const waHref = product.whatsapp_link ?? `https://wa.me/918000485312?text=${encodeURIComponent(waMsg)}`

  const embedUrl = product.video_url ? getVideoEmbed(product.video_url) : null
  const ytThumb = product.video_url ? getYoutubeThumbnail(product.video_url) : null

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

          {/* ── Media gallery ── */}
          <div>
            {/* Main display */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden mb-3">

              {activeItem.type === 'image' ? (
                <>
                  <motion.img
                    key={`img-${activeIndex}`}
                    src={activeItem.url}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-zoom-in"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setLightboxOpen(true)}
                  />
                  {/* Zoom hint */}
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 pointer-events-none">
                    <ZoomIn size={11} />
                    Click to enlarge
                  </div>
                </>
              ) : (
                /* Video player */
                <div className="w-full h-full bg-black flex items-center justify-center">
                  {embedUrl ? (
                    <iframe
                      key={`video-${activeIndex}`}
                      src={embedUrl}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={`${product.name} video`}
                    />
                  ) : (
                    /* Direct video file */
                    <video
                      key={`video-${activeIndex}`}
                      src={activeItem.url}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              )}

              {/* Nav arrows */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white shadow flex items-center justify-center transition-all z-10"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white shadow flex items-center justify-center transition-all z-10"
                    aria-label="Next"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Shortlist button */}
              <button
                onClick={toggleShortlist}
                className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full shadow backdrop-blur-sm transition-all z-10 ${
                  inShortlist ? 'bg-[#B8962E] text-white' : 'bg-white/90 text-gray-400 hover:text-[#B8962E]'
                }`}
                aria-label={inShortlist ? 'Remove from shortlist' : 'Save to shortlist'}
              >
                <Heart size={16} fill={inShortlist ? 'currentColor' : 'none'} />
              </button>

              {/* Counter */}
              {mediaItems.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-full z-10">
                  {activeIndex + 1} / {mediaItems.length}
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            {mediaItems.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {mediaItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 border-2 overflow-hidden transition-all relative ${
                      i === activeIndex ? 'border-[#B8962E]' : 'border-transparent hover:border-gray-300'
                    }`}
                    aria-label={item.type === 'video' ? 'View video' : `View image ${i + 1}`}
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* Video thumbnail */
                      <div className="w-full h-full bg-gray-900 relative">
                        {ytThumb ? (
                          <img src={ytThumb} alt="Video thumbnail" className="w-full h-full object-cover opacity-70" />
                        ) : (
                          <div className="w-full h-full bg-black" />
                        )}
                        {/* Play icon overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="w-6 h-6 bg-[#B8962E] rounded-full flex items-center justify-center">
                            <Play size={10} className="text-white ml-0.5" fill="currentColor" />
                          </div>
                          <span className="text-[8px] text-white font-bold mt-1 uppercase tracking-wide">Video</span>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Video badge below gallery (only when product has video) */}
            {product.video_url && (
              <button
                onClick={() => setActiveIndex(mediaItems.length - 1)}
                className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#B8962E] hover:underline"
              >
                <Play size={13} fill="currentColor" />
                Watch product video
              </button>
            )}
          </div>

          {/* ── Product info ── */}
          <div className="flex flex-col">
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

            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {otherFeatures.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">Features &amp; Specifications</p>
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

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && activeItem.type === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Prev / Next (images only in lightbox) */}
            {allImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length)
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveIndex((i) => (i + 1) % allImages.length)
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Image */}
            <motion.img
              key={activeIndex}
              src={activeItem.url}
              alt={product.name}
              className="max-w-[90vw] max-h-[90vh] object-contain select-none"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
                {activeIndex + 1} / {allImages.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        prefilledProduct={product.name}
      />
    </div>
  )
}
