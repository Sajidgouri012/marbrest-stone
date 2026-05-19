'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, ClipboardList } from 'lucide-react'

interface CatalogueFloatingActionsProps {
  shortlistCount: number
  onOpenShortlist: () => void
  onOpenQuote: () => void
}

export default function CatalogueFloatingActions({
  shortlistCount,
  onOpenShortlist,
  onOpenQuote,
}: CatalogueFloatingActionsProps) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Build WhatsApp message based on current page */
  const waMessage =
    pathname.includes('/catalogue/') && pathname !== '/catalogue'
      ? `Hi Marbrest Stone! I'm viewing your ${pathname.split('/catalogue/')[1]} catalogue and would like to know more about pricing and availability.`
      : `Hi Marbrest Stone! I'm browsing your catalogue and would like to enquire about your marble products.`

  const waHref = `https://wa.me/918000485312?text=${encodeURIComponent(waMessage)}`

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-2">
      {/* Get a Quote — appears after scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            key="quote-btn"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.25 }}
            onClick={onOpenQuote}
            className="hidden sm:flex items-center gap-2 h-11 px-4 bg-[#B8962E] text-white font-semibold text-sm rounded-full shadow-lg hover:bg-[#9A7D25] transition-colors"
          >
            <MessageSquare size={16} />
            <span>Get a Quote</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp — always visible */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 h-11 px-4 sm:pr-4 sm:pl-3 bg-[#25D366] text-white font-semibold text-sm rounded-full shadow-lg hover:bg-[#1daa54] transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      {/* Shortlist — always visible */}
      <button
        onClick={onOpenShortlist}
        className="flex items-center gap-2 h-11 px-4 bg-[#1A1A1A] text-white font-semibold text-sm rounded-full shadow-lg hover:bg-[#2d2d2d] transition-colors"
        aria-label={`Shortlist (${shortlistCount} items)`}
      >
        <ClipboardList size={16} className="flex-shrink-0" />
        <span className="hidden sm:inline">Shortlist</span>
        {shortlistCount > 0 && (
          <span className="bg-[#B8962E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
            {shortlistCount}
          </span>
        )}
      </button>
    </div>
  )
}
