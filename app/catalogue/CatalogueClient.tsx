'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'
import ProductCard, { type CatalogueProduct } from '@/components/catalogue/ProductCard'
import QuoteModal from '@/components/catalogue/QuoteModal'
import ShortlistDrawer from '@/components/catalogue/ShortlistDrawer'
import CatalogueFloatingActions from '@/components/catalogue/CatalogueFloatingActions'
import DownloadPDFButton from '@/components/catalogue/DownloadPDFButton'
import ExitIntentPopup from '@/components/catalogue/ExitIntentPopup'
import type { PDFProduct } from '@/lib/generateCataloguePDF'

interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  display_order: number
  visible: boolean
}

interface Props {
  initialCategories: ProductCategory[]
  initialProducts: CatalogueProduct[]
}

const FINISH_KW = ['polished', 'honed', 'brushed', 'sand-blasted', 'matte', 'glossy', 'finish']
const DIM_KW = ['size', 'dimension', 'cm', 'mm', 'inch', 'ft', 'custom size']

function toPDFProduct(p: CatalogueProduct): PDFProduct {
  const finish = p.features
    .filter((f) => FINISH_KW.some((k) => f.toLowerCase().includes(k)))
    .join(', ') || undefined
  const dimensions = p.features.find((f) =>
    DIM_KW.some((k) => f.toLowerCase().includes(k))
  )
  return {
    id: p.id,
    name: p.name,
    category: p.product_category?.name ?? 'Marble Products',
    description: p.description,
    images: [p.image_url, ...(p.images ?? [])],
    material: 'Makrana White Marble',
    origin: p.origin,
    finish,
    dimensions,
    exportReady: p.features.some((f) =>
      ['export', 'bulk', 'international'].some((k) => f.toLowerCase().includes(k))
    ),
  }
}

/* ── Sticky category nav ──────────────────────────────────────────────────── */
function StickyNav({
  categories,
  activeSlug,
  onTabClick,
}: {
  categories: ProductCategory[]
  activeSlug: string
  onTabClick: (slug: string) => void
}) {
  return (
    <div className="sticky top-16 lg:top-20 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div
          className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none"
          style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          <button
            onClick={() => onTabClick('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              activeSlug === 'all'
                ? 'bg-[#B8962E] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onTabClick(cat.slug)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeSlug === cat.slug
                  ? 'bg-[#B8962E] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── "View All" card ─────────────────────────────────────────────────────── */
function ViewAllCard({ category, count }: { category: ProductCategory; count: number }) {
  return (
    <Link
      href={`/catalogue/${category.slug}`}
      className="group bg-[#1A1A1A] hover:bg-[#2d2d2d] transition-all duration-300 overflow-hidden flex flex-col items-center justify-center border border-gray-800 hover:border-[#B8962E] min-h-[160px]"
    >
      <ArrowRight
        size={32}
        className="text-[#B8962E] group-hover:translate-x-1 transition-transform duration-300 mb-3"
      />
      <p className="text-white font-semibold text-sm text-center px-3">View All</p>
      <p className="text-[#B8962E] font-semibold text-sm text-center px-3 mt-0.5">
        {category.name}
      </p>
      <p className="text-gray-400 text-xs mt-1">({count} products)</p>
    </Link>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function CatalogueClient({ initialCategories, initialProducts }: Props) {
  const [shortlist, setShortlist] = useState<CatalogueProduct[]>([])
  const [shortlistOpen, setShortlistOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteProduct, setQuoteProduct] = useState('')
  const [activeSection, setActiveSection] = useState('all')
  const sectionRefs = useRef<Record<string, IntersectionObserver>>({})

  /* Load shortlist from localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('marbrest_shortlist')
      if (saved) setShortlist(JSON.parse(saved))
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'marbrest_shortlist' && e.newValue) {
        try { setShortlist(JSON.parse(e.newValue)) } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /* IntersectionObserver for active section tracking */
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    initialCategories.forEach((cat) => {
      const el = document.getElementById(cat.slug)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(cat.slug) },
        { rootMargin: '-15% 0px -65% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
      sectionRefs.current[cat.slug] = obs
    })
    return () => observers.forEach((obs) => obs.disconnect())
  }, [initialCategories])

  const toggleShortlist = useCallback((product: CatalogueProduct) => {
    setShortlist((prev) => {
      const exists = prev.find((p) => p.id === product.id)
      const next = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product]
      try { localStorage.setItem('marbrest_shortlist', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const openQuote = useCallback((productName = '') => {
    setQuoteProduct(productName)
    setQuoteOpen(true)
  }, [])

  const handleTabClick = (slug: string) => {
    setActiveSection(slug)
    if (slug === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.replaceState(null, '', '/catalogue')
      return
    }
    const el = document.getElementById(slug)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', `/catalogue#${slug}`)
    }
  }

  /* Group products by category */
  const productsByCategory = initialCategories
    .map((cat, idx) => {
      const catProducts = initialProducts.filter(
        (p) => p.product_category_id === cat.id || p.product_category?.id === cat.id
      )
      return { category: cat, products: catProducts.slice(0, 4), totalCount: catProducts.length, index: idx }
    })
    .filter((g) => g.products.length > 0)

  const allPDFProducts = initialProducts.map(toPDFProduct)

  const shortlistIds = new Set(shortlist.map((p) => p.id))

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 px-6 lg:px-8 bg-[#1A1A1A] text-white">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#B8962E] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-[#B8962E]">Catalogue</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
                  Our Stone &amp; Marble<br />
                  <span className="text-[#B8962E]">Catalogue</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">
                  From the legendary quarries of Makrana — browse our complete collection of premium marble flooring, bespoke carvings, sacred space installations, and export-ready stone products. Each piece crafted by master artisans with 30+ years of heritage.
                </p>

                {/* Trust stats */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {['600+ Projects', '30+ Years', '50+ Craftsmen', '30+ Countries'].map((stat) => (
                    <span key={stat} className="text-[#B8962E] font-semibold">{stat}</span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-col sm:flex-row lg:flex-col gap-3"
            >
              <DownloadPDFButton
                type="full"
                products={allPDFProducts}
                variant="outline"
                className="text-white [&>button]:text-white [&>button]:border-white [&>button]:hover:border-[#B8962E]"
              />
              <button
                onClick={() => openQuote()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B8962E] text-white font-semibold hover:bg-[#9A7D25] transition-colors whitespace-nowrap"
              >
                Request a Quote
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Sticky Category Nav ───────────────────────────────────────────── */}
      <StickyNav
        categories={initialCategories}
        activeSlug={activeSection}
        onTabClick={handleTabClick}
      />

      {/* ── Category Sections ─────────────────────────────────────────────── */}
      <div className="bg-white">
        {productsByCategory.map(({ category, products, totalCount, index }) => (
          <section
            key={category.id}
            id={category.slug}
            className="max-w-7xl mx-auto px-6 lg:px-8 py-10 scroll-mt-[120px] lg:scroll-mt-[140px]"
          >
            {/* Category header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold text-[#B8962E] uppercase tracking-[0.2em] mb-2">
                  CATEGORY {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-1">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">{totalCount} products available</p>
                {category.description && (
                  <p className="text-sm text-gray-600 max-w-xl">{category.description}</p>
                )}
              </div>
              <Link
                href={`/catalogue/${category.slug}`}
                className="flex-shrink-0 flex items-center gap-1 text-[#B8962E] font-semibold text-sm hover:gap-2 transition-all duration-200 group"
              >
                View All {category.name}
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                  isInShortlist={shortlistIds.has(product.id)}
                  onToggleShortlist={toggleShortlist}
                  onQuote={openQuote}
                  variant="compact"
                  onCategoryClick={(slug) => handleTabClick(slug)}
                />
              ))}
              {/* View All card as 5th slot */}
              <ViewAllCard category={category} count={totalCount} />
            </div>

            {/* Gold divider (not after last section) */}
            {index < productsByCategory.length - 1 && (
              <div className="mt-10 h-px bg-gradient-to-r from-transparent via-[#B8962E]/40 to-transparent" />
            )}
          </section>
        ))}
      </div>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-8 bg-[#1A1A1A] text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-4">
            Didn&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-gray-300 mb-8 text-sm sm:text-base">
            Every piece can be fully customized. Share your vision and our master craftsmen will bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openQuote()}
              className="px-10 py-4 bg-[#B8962E] text-white font-semibold tracking-wide hover:bg-[#9A7D25] transition-colors"
            >
              REQUEST CUSTOM QUOTE
            </button>
            <Link
              href="/portfolio"
              className="px-10 py-4 border-2 border-white text-white font-semibold tracking-wide hover:bg-white hover:text-charcoal transition-all duration-300"
            >
              VIEW OUR WORK
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Modals & Overlays ─────────────────────────────────────────────── */}
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

      <ExitIntentPopup />
    </div>
  )
}
