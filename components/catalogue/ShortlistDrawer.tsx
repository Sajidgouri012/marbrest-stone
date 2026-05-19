'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ClipboardList } from 'lucide-react'
import type { CatalogueProduct } from './ProductCard'
import type { PDFProduct } from '@/lib/generateCataloguePDF'
import DownloadPDFButton from './DownloadPDFButton'

interface ShortlistDrawerProps {
  isOpen: boolean
  onClose: () => void
  shortlist: CatalogueProduct[]
  onRemove: (product: CatalogueProduct) => void
  onQuoteAll: () => void
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

export default function ShortlistDrawer({
  isOpen,
  onClose,
  shortlist,
  onRemove,
  onQuoteAll,
}: ShortlistDrawerProps) {
  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* Close on Escape */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const pdfProducts = shortlist.map(toPDFProduct)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="shortlist-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="shortlist-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[380px] bg-white shadow-2xl flex flex-col"
            aria-label="My Shortlist"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ClipboardList size={20} className="text-[#B8962E]" />
                <h2 className="font-serif font-bold text-charcoal text-lg">My Shortlist</h2>
                {shortlist.length > 0 && (
                  <span className="bg-[#B8962E] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {shortlist.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-charcoal transition-colors"
                aria-label="Close shortlist"
              >
                <X size={20} />
              </button>
            </div>

            {/* Product list */}
            <div className="flex-1 overflow-y-auto">
              {shortlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="text-5xl mb-4">🤍</div>
                  <p className="font-semibold text-charcoal mb-2">No products saved yet.</p>
                  <p className="text-sm text-gray-500">
                    Click ♡ on any product to save it to your shortlist.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {shortlist.map((product) => (
                    <li key={product.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal text-sm line-clamp-2 leading-tight">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {product.product_category?.name ?? product.origin}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemove(product)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label={`Remove ${product.name} from shortlist`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer actions */}
            {shortlist.length > 0 && (
              <div className="flex-shrink-0 border-t border-gray-200 p-4 space-y-3 bg-gray-50">
                <button
                  onClick={onQuoteAll}
                  className="w-full py-3 bg-[#B8962E] text-white font-semibold text-sm hover:bg-[#9A7D25] transition-colors flex items-center justify-center gap-2"
                >
                  Request Quote for All ({shortlist.length} items)
                </button>
                <DownloadPDFButton
                  type="shortlist"
                  products={pdfProducts}
                  categoryName="My Shortlist"
                  variant="sidebar"
                />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
