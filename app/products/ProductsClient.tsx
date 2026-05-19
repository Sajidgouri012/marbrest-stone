'use client'

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Check, Sparkles, X, Filter, ChevronRight, Heart, Play } from 'lucide-react'
import Link from 'next/link'
import QuoteModal from '@/components/catalogue/QuoteModal'
import ShortlistDrawer from '@/components/catalogue/ShortlistDrawer'
import CatalogueFloatingActions from '@/components/catalogue/CatalogueFloatingActions'
import type { CatalogueProduct } from '@/components/catalogue/ProductCard'

interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  display_order: number
  visible: boolean
}

export default function ProductsClient({
  initialProducts,
  initialCategories,
  initialShowCategories,
}: {
  initialProducts: CatalogueProduct[]
  initialCategories: ProductCategory[]
  initialShowCategories: boolean
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteProduct, setQuoteProduct] = useState('')
  const [shortlistOpen, setShortlistOpen] = useState(false)
  const [shortlist, setShortlist] = useState<CatalogueProduct[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem('marbrest_shortlist') || '[]') } catch { return [] }
  })

  const openQuote = useCallback((productName = '') => {
    setQuoteProduct(productName)
    setQuoteOpen(true)
  }, [])

  const toggleShortlist = useCallback((product: CatalogueProduct) => {
    setShortlist((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      const next = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product]
      try { localStorage.setItem('marbrest_shortlist', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const filteredProducts = initialProducts.filter((p) => {
    if (selectedCategory !== 'all') {
      const category = initialCategories.find((t) => t.id === p.product_category_id)
      if (category?.slug !== selectedCategory) return false
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      return p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    }
    return true
  })

  const shortlistIds = new Set(shortlist.map((p) => p.id))

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
              Our Marble & Stone Products — Fully Customizable, Export-Ready
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Premium marble, granite & stone products • Marble flooring installations • Mosque & temple artistry •
              Carved handicrafts • Home decor • Complete contract work for residential & commercial projects
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gold/10 border border-gold/30 rounded-full">
                <Sparkles className="text-gold" size={20} />
                <span className="text-gold font-medium">Fully Customizable</span>
              </div>
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gold/10 border border-gold/30 rounded-full">
                <Check className="text-gold" size={20} />
                <span className="text-gold font-medium">Contract Work Available</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Design Message */}
      <section className="py-8 px-6 lg:px-8 bg-gradient-to-r from-gold/5 to-gold/10 border-y border-gold/20">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg md:text-xl text-charcoal leading-relaxed">
            <span className="font-semibold text-gold">Note:</span> All these products are available, but we also create{' '}
            <span className="font-semibold text-charcoal">custom designs</span> based on your choice of{' '}
            <span className="font-semibold text-charcoal">pattern, design, and stone type</span>.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gold text-charcoal font-semibold hover:bg-gold-light transition-all duration-300 text-sm"
            >
              <Sparkles size={16} />
              Request Custom Design
            </a>
          </div>
        </div>
      </section>

      {/* Search Bar and Filter Button */}
      <section className="py-6 px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-3.5 bg-gold text-charcoal font-semibold hover:bg-gold-light transition-all duration-300 whitespace-nowrap"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={
                  selectedCategory === 'all'
                    ? 'Search all products...'
                    : `Search in ${initialCategories.find((t) => t.slug === selectedCategory)?.name || 'category'}...`
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3.5 pr-12 border-2 border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-charcoal placeholder-gray-400"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside
              className={`${
                isSidebarOpen ? 'fixed inset-0 z-50 bg-black/50' : 'hidden'
              } lg:relative lg:block lg:w-64 lg:flex-shrink-0 lg:bg-transparent`}
            >
              <div
                className={`${
                  isSidebarOpen ? 'absolute left-0 top-0 bottom-0 w-[72vw] max-w-[260px] bg-white shadow-2xl overflow-y-auto' : ''
                } lg:sticky lg:top-24 lg:bg-gray-50 lg:p-6 lg:rounded-lg lg:shadow-sm`}
              >
                {isSidebarOpen && (
                  <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-charcoal text-white">
                    <h3 className="text-sm font-semibold">Filter Products</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                )}
                <div className="p-4 lg:p-0">
                  <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3 hidden lg:block">Categories</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setSelectedCategory('all'); setIsSidebarOpen(false) }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between group ${
                        selectedCategory === 'all' ? 'bg-gold text-charcoal shadow-md' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>All Products</span>
                      {selectedCategory === 'all' && <ChevronRight size={16} className="text-charcoal" />}
                    </button>
                    {initialShowCategories && initialCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products/${category.slug}`}
                        onClick={() => setIsSidebarOpen(false)}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between group text-gray-700 hover:bg-gray-100 hover:text-[#B8962E]"
                      >
                        <span>{category.name}</span>
                        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#B8962E]" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-charcoal">{filteredProducts.length}</span>
                  {' '}{filteredProducts.length === 1 ? 'product' : 'products'}
                  {selectedCategory !== 'all' && (
                    <span> in <span className="font-semibold text-gold">{initialCategories.find((t) => t.slug === selectedCategory)?.name}</span></span>
                  )}
                  {searchQuery && (
                    <span> matching &ldquo;<span className="font-semibold text-charcoal">{searchQuery}</span>&rdquo;</span>
                  )}
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg mb-2">No products found.</p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <button
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
                      className="text-gold hover:text-gold-light font-medium underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      isInShortlist={shortlistIds.has(product.id)}
                      onToggleShortlist={toggleShortlist}
                      onQuote={openQuote}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Customization CTA */}
      <section className="py-20 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold mb-6">
              Need Something <span className="text-gold">Unique?</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-8">
              Every piece can be customized to your exact requirements. Choose your dimensions,
              finish, edge profile, and more. Our master craftsmen will bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-block px-10 py-4 bg-gold text-charcoal font-semibold tracking-wide hover:bg-gold-light transition-all duration-300">
                REQUEST CUSTOM QUOTE
              </a>
              <a href="/portfolio" className="inline-block px-10 py-4 border-2 border-white text-white font-semibold tracking-wide hover:bg-white hover:text-charcoal transition-all duration-300">
                VIEW OUR WORK
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        prefilledProduct={quoteProduct}
      />

      <ShortlistDrawer
        isOpen={shortlistOpen}
        onClose={() => setShortlistOpen(false)}
        shortlist={shortlist}
        onRemove={toggleShortlist}
        onQuoteAll={() => {
          setShortlistOpen(false)
          openQuote(shortlist.map((p) => p.name).join(', '))
        }}
      />

      <CatalogueFloatingActions
        shortlistCount={shortlist.length}
        onOpenShortlist={() => setShortlistOpen(true)}
        onOpenQuote={() => openQuote()}
      />
    </div>
  )
}

/* ── Product Card ─────────────────────────────────────────────────────────── */
function ProductCard({
  product,
  index,
  isInShortlist,
  onToggleShortlist,
  onQuote,
}: {
  product: CatalogueProduct
  index: number
  isInShortlist: boolean
  onToggleShortlist: (product: CatalogueProduct) => void
  onQuote: (name: string) => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const router = useRouter()
  const categorySlug = product.product_category?.slug ?? ''

  const getPriceDisplay = () => {
    if (product.price_type === 'fixed' && product.base_price) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.base_price)
    }
    if (product.price_type === 'range' && product.min_price) {
      return `From ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.min_price)}`
    }
    return 'Request Quote'
  }

  const detailHref = categorySlug ? `/products/${categorySlug}/${product.id}` : null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      onClick={() => detailHref && router.push(detailHref)}
      className="group relative bg-white border border-gray-200 hover:border-[#B8962E] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={product.image_url}
          alt={`${product.name} — ${product.origin} marble by Marbrest Stone`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Video badge — bottom left */}
        {product.video_url && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
            <Play size={8} fill="currentColor" />
            Video
          </div>
        )}

        {/* Top right: badges + heart */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {product.customizable && (
            <span className="bg-[#B8962E] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
              CUSTOM
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleShortlist(product) }}
            className={`w-7 h-7 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 shadow-sm ${
              isInShortlist ? 'bg-[#B8962E] text-white' : 'bg-white/90 text-gray-400 hover:text-[#B8962E]'
            }`}
            aria-label={isInShortlist ? 'Remove from shortlist' : 'Save to shortlist'}
          >
            <Heart size={14} fill={isInShortlist ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-charcoal text-sm mb-1 line-clamp-2 group-hover:text-[#B8962E] transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.origin}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-charcoal">{getPriceDisplay()}</span>
          {product.price_unit && product.price_type !== 'quote' && (
            <span className="text-[10px] text-gray-400">{product.price_unit}</span>
          )}
        </div>

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => { e.stopPropagation(); onQuote(product.name) }}
            className="flex-1 py-2 text-[11px] font-semibold bg-[#B8962E] text-white hover:bg-[#9A7D25] transition-colors"
          >
            Quick Quote
          </button>
          {detailHref && (
            <Link
              href={detailHref}
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-2 text-[11px] font-semibold border border-gray-300 text-gray-700 hover:border-[#B8962E] hover:text-[#B8962E] transition-colors flex items-center"
              title="View product details"
            >
              ↗
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
