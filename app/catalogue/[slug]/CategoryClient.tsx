'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, MessageSquare } from 'lucide-react'
import ProductCard, { type CatalogueProduct } from '@/components/catalogue/ProductCard'
import QuoteModal from '@/components/catalogue/QuoteModal'
import ShortlistDrawer from '@/components/catalogue/ShortlistDrawer'
import CatalogueFloatingActions from '@/components/catalogue/CatalogueFloatingActions'
import SampleBanner from '@/components/catalogue/SampleBanner'
import DownloadPDFButton from '@/components/catalogue/DownloadPDFButton'
import type { PDFProduct } from '@/lib/generateCataloguePDF'

interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  display_order: number
  visible: boolean
}

interface CategoryClientProps {
  category: ProductCategory
  initialProducts: CatalogueProduct[]
  allCategories: ProductCategory[]
}

const PAGE_SIZE = 12

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

export default function CategoryClient({
  category,
  initialProducts,
  allCategories,
}: CategoryClientProps) {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteProduct, setQuoteProduct] = useState('')
  const [shortlist, setShortlist] = useState<CatalogueProduct[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem('marbrest_shortlist') || '[]') } catch { return [] }
  })
  const [shortlistOpen, setShortlistOpen] = useState(false)

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

  const sorted = [...initialProducts].sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999)
  )

  const displayed = sorted.slice(0, displayCount)
  const remaining = sorted.length - displayed.length
  const shortlistIds = new Set(shortlist.map((p) => p.id))

  /* Inject sample banner after 6th product */
  const displayItems: (CatalogueProduct | 'sample-banner')[] = []
  displayed.forEach((p, i) => {
    displayItems.push(p)
    if (i === 5) displayItems.push('sample-banner')
  })

  const pdfProducts = sorted.map(toPDFProduct)
  const waMsg = `Hi Marbrest Stone! I'm viewing your ${category.name} catalogue and would like to know more about pricing and availability.`

  /* ── Sidebar ──────────────────────────────────────────────────────────── */
  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Category info card */}
      <div className="border border-gray-200 overflow-hidden">
        <div className="aspect-video bg-gray-100">
          {initialProducts[0]?.image_url && (
            <img
              src={initialProducts[0].image_url}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="font-serif font-bold text-charcoal text-lg mb-1">{category.name}</h3>
          <span className="inline-block bg-[#B8962E]/10 text-[#B8962E] text-xs font-semibold px-2 py-0.5 rounded mb-3">
            {initialProducts.length} products
          </span>
          {category.description && (
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{category.description}</p>
          )}
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="text-[#B8962E]">✓</span> Export Ready
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#B8962E]">✓</span> Lead time: 3–6 weeks typical
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Download PDF */}
      <DownloadPDFButton
        type="category"
        products={pdfProducts}
        categoryName={category.name}
        variant="sidebar"
      />

      {/* Request Quote */}
      <button
        onClick={() => openQuote()}
        className="w-full py-2.5 border-2 border-[#B8962E] text-[#B8962E] font-semibold text-sm hover:bg-[#B8962E] hover:text-white transition-colors flex items-center justify-center gap-2"
      >
        <MessageSquare size={15} />
        Request a Quote
      </button>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/918000485312?text=${encodeURIComponent(waMsg)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2.5 bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1daa54] transition-colors flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Chat on WhatsApp
      </a>

      <div className="h-px bg-gray-200" />

      {/* Other categories */}
      {allCategories.slice(0, 4).length > 0 && (
        <div>
          <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">Other Collections</p>
          <div className="space-y-2">
            {allCategories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogue/${cat.slug}`}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 hover:bg-[#B8962E]/5 hover:text-[#B8962E] transition-colors text-sm font-medium text-gray-700 rounded"
              >
                {cat.name}
                <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#B8962E] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/catalogue" className="hover:text-[#B8962E] transition-colors">Catalogue</Link>
            <ChevronRight size={12} />
            <span className="text-[#B8962E] font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden bg-[#1A1A1A] text-white px-6 py-8">
        <h1 className="text-2xl font-serif font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-300 text-sm mb-3">{category.description}</p>
        )}
        <span className="text-[#B8962E] text-sm font-semibold">{initialProducts.length} products available</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ── Desktop Sidebar ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="sticky top-24">
              <SidebarContent />
            </div>
          </aside>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Desktop page title */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-3xl font-serif font-bold text-charcoal mb-1">{category.name}</h1>
              {category.description && (
                <p className="text-gray-600 text-sm">{category.description}</p>
              )}
            </div>

            {/* Product count bar */}
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-charcoal">{Math.min(displayCount, sorted.length)}</span> of{' '}
                <span className="font-semibold text-charcoal">{sorted.length}</span> products
              </p>
            </div>

            {/* Product grid */}
            {sorted.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500">No products available in this category.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {displayItems.map((item, i) =>
                    item === 'sample-banner' ? (
                      <SampleBanner
                        key="sample-banner"
                        categoryName={category.name}
                        onRequest={() => openQuote('Sample Request')}
                      />
                    ) : (
                      <ProductCard
                        key={(item as CatalogueProduct).id}
                        product={item as CatalogueProduct}
                        index={i}
                        isInShortlist={shortlistIds.has((item as CatalogueProduct).id)}
                        onToggleShortlist={toggleShortlist}
                        onQuote={openQuote}
                        variant="full"
                      />
                    )
                  )}
                </div>

                {/* Load more */}
                {remaining > 0 && (
                  <div className="text-center mt-10">
                    <p className="text-sm text-gray-500 mb-4">
                      Showing {displayed.length} of {sorted.length} products
                    </p>
                    <button
                      onClick={() => setDisplayCount((c) => c + PAGE_SIZE)}
                      className="px-8 py-3 border-2 border-[#B8962E] text-[#B8962E] font-semibold text-sm hover:bg-[#B8962E] hover:text-white transition-all duration-200"
                    >
                      Load More Products ({remaining} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Related Categories ───────────────────────────────────────────── */}
      {allCategories.length > 0 && (
        <section className="py-16 px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-serif font-bold text-charcoal mb-2">Explore Our Other Collections</h2>
            <div className="h-0.5 w-12 bg-[#B8962E] mb-8" />
            <div
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-none"
              style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
            >
              {allCategories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalogue/${cat.slug}`}
                  className="group flex-shrink-0 w-[200px] overflow-hidden border border-gray-200 hover:border-[#B8962E] hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
                      <p className="text-white font-semibold text-sm">{cat.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Mobile bottom action bar ──────────────────────────────────────── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <DownloadPDFButton
          type="category"
          products={pdfProducts}
          categoryName={category.name}
          variant="primary"
          className="flex-1 [&>button]:w-full [&>button]:justify-center [&>button]:h-[60px] [&>button]:rounded-none [&>button]:text-sm"
        />
        <button
          onClick={() => openQuote()}
          className="flex-1 h-[60px] bg-[#9A7D25] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#8A6D15] transition-colors"
        >
          <MessageSquare size={16} />
          Request Quote
        </button>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <QuoteModal
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        prefilledProduct={quoteProduct !== 'Sample Request' ? quoteProduct : ''}
        prefilledProjectType={quoteProduct === 'Sample Request' ? 'Sample Request' : ''}
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
