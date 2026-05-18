'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Eye, Play, X, ChevronRight, Sparkles } from 'lucide-react'
import ProductDetailModal from '@/components/ProductDetailModal'

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
  video_url?: string
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
}

export default function CategoryProductsClient({
  category,
  initialProducts,
  allCategories,
  currentSlug,
}: {
  category: ProductCategory
  initialProducts: Product[]
  allCategories: ProductCategory[]
  currentSlug: string
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const filtered = initialProducts.filter((p) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  })

  /* Other categories for the "Browse More" strip */
  const otherCategories = allCategories.filter((c) => c.slug !== currentSlug).slice(0, 8)

  return (
    <div className="min-h-screen pt-16 lg:pt-20 pb-20 md:pb-0">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-charcoal text-white">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#B8962E] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-[#B8962E] transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-[#B8962E]">{category.name}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-[#B8962E]/20 text-[#B8962E] text-xs font-semibold uppercase tracking-wider sm:tracking-widest rounded-full">
                Marbrest Stone
              </span>
            </div>
            <h1 className="font-serif font-bold text-white mb-4 max-w-3xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-300 max-w-2xl leading-relaxed">
                {category.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 mt-8 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8962E]" />
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8962E]" />
                All fully customizable
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8962E]" />
                Export-ready to 30+ countries
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Custom design banner ──────────────────────────────────────── */}
      <section className="py-5 bg-[#F8F5F0] border-b border-[#E8E0D5]">
        <div className="container">
          <p className="text-sm md:text-base text-charcoal text-center">
            <span className="font-semibold text-[#B8962E]">All products are customizable.</span>
            {' '}Choose your pattern, design, dimensions, and stone type.{' '}
            <a href="/contact" className="underline hover:text-[#B8962E] transition-colors">
              Request a custom design →
            </a>
          </p>
        </div>
      </section>

      {/* ── Search bar ───────────────────────────────────────────────── */}
      <section className="py-5 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30">
        <div className="container">
          <div className="relative max-w-xl mx-auto md:mx-0">
            <input
              type="text"
              placeholder={`Search in ${category.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-charcoal placeholder-gray-400 focus:outline-none focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/15 transition-all"
              style={{ fontSize: '16px' }}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Product grid ─────────────────────────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-4">
                {searchQuery
                  ? `No products found matching "${searchQuery}"`
                  : `No products in this category yet.`}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#B8962E] hover:underline text-sm font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Showing <span className="font-semibold text-charcoal">{filtered.length}</span>{' '}
                {filtered.length === 1 ? 'product' : 'products'}
                {searchQuery && (
                  <span> for &ldquo;<span className="text-charcoal font-medium">{searchQuery}</span>&rdquo;</span>
                )}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {filtered.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Browse other categories ───────────────────────────────────── */}
      {otherCategories.length > 0 && (
        <section className="py-14 bg-[#F8F5F0]">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="font-serif font-bold text-charcoal mb-2">
                Explore More Categories
              </h2>
              <p className="text-gray-500 text-sm">
                Browse our full range of Makrana marble products
              </p>
            </div>

            {/* Horizontal scroll on mobile, wrap on desktop */}
            <div className="flex gap-3 overflow-x-auto pb-3 md:flex-wrap md:justify-center scrollbar-hide"
              style={{ scrollbarWidth: 'none' }}
            >
              {otherCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products/${cat.slug}`}
                  className="flex-shrink-0 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-charcoal hover:border-[#B8962E] hover:text-[#B8962E] transition-all duration-200 whitespace-nowrap shadow-sm"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/products"
                className="flex-shrink-0 px-4 py-2.5 bg-[#B8962E] text-white rounded-full text-sm font-semibold hover:bg-[#9A7D25] transition-colors whitespace-nowrap shadow-sm"
              >
                View All →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-[#1A1A1A] text-white">
        <div className="container">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="lg:max-w-xl">
              <h2 className="font-serif font-bold mb-3">
                Need a Custom <span className="text-[#B8962E]">{category.name}</span> Design?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Every piece can be customized to your exact requirements — dimensions, finish,
                pattern, and stone type. Our master craftsmen will bring your vision to life.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href="/contact"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#B8962E] text-white font-semibold rounded-md hover:bg-[#9A7D25] transition-colors"
              >
                <Sparkles size={18} />
                Request Custom Quote
              </a>
              <p className="text-center text-gray-500 text-sm">
                ✓ Free Consultation &nbsp;✓ 24hr Response &nbsp;✓ No Commitment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

/* ── Product Card ─────────────────────────────────────────────────────────── */
function ProductCard({
  product,
  index,
  onClick,
}: {
  product: Product
  index: number
  onClick: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const getPriceDisplay = () => {
    if (product.price_type === 'fixed' && product.base_price) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.base_price)
    }
    if (product.price_type === 'range' && product.min_price) {
      return `From ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.min_price)}`
    }
    return 'Request Quote'
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      onClick={onClick}
      className="group relative bg-white border border-gray-200 hover:border-[#B8962E] hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden rounded-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={`${product.name} — ${product.origin} marble by Marbrest Stone`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.customizable && (
            <span className="bg-[#B8962E] px-2 py-0.5 rounded text-white text-[10px] font-bold">CUSTOM</span>
          )}
          {product.video_url && (
            <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1">
              <Play size={10} className="text-white" fill="white" />
              <span className="text-white text-[10px] font-medium">VIDEO</span>
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <Eye size={18} />
            <span>View Details</span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        <h3 className="font-semibold text-charcoal text-sm mb-1 line-clamp-2 group-hover:text-[#B8962E] transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.origin}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-charcoal">{getPriceDisplay()}</span>
          {product.price_unit && product.price_type !== 'quote' && (
            <span className="text-[10px] text-gray-400">{product.price_unit}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
