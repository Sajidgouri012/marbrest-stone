'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/craftsmanship', label: 'Craftsmanship' },
  { href: '/products', label: 'Products' },
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/testimonials', label: 'Testimonials' },
  { href: '/contact', label: 'Contact' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  /* Only the home page uses the transparent-over-hero style */
  const isHome = pathname === '/'
  const isContact = pathname === '/contact'

  /* On non-home pages the nav is always solid — never transparent */
  const transparentNav = isHome && !isScrolled

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const closeMenu = () => setIsMobileMenuOpen(false)

  /* Text / background logic */
  const navBg = transparentNav ? 'bg-transparent' : 'glass-effect shadow-md'
  const logoMainColor = transparentNav ? 'text-white' : 'text-charcoal'
  const linkColor = transparentNav
    ? 'text-white hover:text-[#B8962E]'
    : 'text-charcoal hover:text-[#B8962E]'

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        {/* ── Desktop (≥1024px) ────────────────────────────────────── */}
        <div className="hidden lg:block max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-serif font-bold tracking-tight">
                <span className={`${logoMainColor} transition-colors`}>MARBREST</span>
                <span className="text-[#B8962E] ml-2">STONE</span>
              </span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium uppercase tracking-[0.08em] transition-colors duration-200 relative group ${linkColor} ${
                    (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)) ? '!text-[#B8962E]' : ''
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B8962E] transition-transform origin-left ${
                      (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/contact"
              className="inline-block px-6 py-2.5 bg-[#B8962E] text-white font-semibold text-sm tracking-wide rounded-md hover:bg-[#9A7D25] transition-colors duration-200 shadow-sm whitespace-nowrap"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        {/* ── Mobile (<1024px) ─────────────────────────────────────── */}
        <div className="lg:hidden px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 min-w-0" onClick={closeMenu}>
              <span className="text-lg font-serif font-bold tracking-tight">
                <span className={`${logoMainColor} transition-colors`}>MARBREST</span>
                <span className="text-[#B8962E] ml-1.5">STONE</span>
              </span>
            </Link>

            {/* Get Quote + Hamburger */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/contact"
                onClick={closeMenu}
                className="inline-block px-3.5 py-1.5 bg-[#B8962E] text-white font-semibold rounded-md hover:bg-[#9A7D25] transition-colors whitespace-nowrap"
                style={{ fontSize: '0.8rem' }}
              >
                Get Quote
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`flex items-center justify-center w-11 h-11 transition-colors ${
                  transparentNav ? 'text-white hover:text-[#B8962E]' : 'text-charcoal hover:text-[#B8962E]'
                }`}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X size={24} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu size={24} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Full-screen mobile drawer ────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeMenu}
              className="lg:hidden fixed inset-0 z-40 bg-black/60"
            />

            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[72vw] max-w-[280px] z-50 bg-[#1A1A1A] flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 flex-shrink-0">
                <span className="text-lg font-serif font-bold">
                  <span className="text-white">MARBREST</span>
                  <span className="text-[#B8962E] ml-1.5">STONE</span>
                </span>
                <button
                  onClick={closeMenu}
                  className="flex items-center justify-center w-11 h-11 text-white hover:text-[#B8962E] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 px-6 pt-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className={`block py-3 text-base font-serif font-medium border-b border-white/10 transition-colors ${
                        (link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)) ? 'text-[#B8962E]' : 'text-white hover:text-[#B8962E]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer of drawer */}
              <div className="px-6 pb-8 flex-shrink-0">
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="block w-full text-center py-4 bg-[#B8962E] text-white font-semibold text-base rounded-md hover:bg-[#9A7D25] transition-colors mb-6"
                >
                  Request a Consultation
                </Link>
                <div className="space-y-2 text-sm text-gray-400">
                  <a href="tel:+918000485312" className="flex items-center gap-2 hover:text-white transition-colors">
                    <span>📞</span><span>+91 80004 85312</span>
                  </a>
                  <a href="mailto:info@marbreststone.com" className="flex items-center gap-2 hover:text-white transition-colors">
                    <span>✉️</span><span>info@marbreststone.com</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Sticky bottom CTA bar — mobile only, hidden on /contact ──────── */}
      {!isContact && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-40"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <Link
            href="/contact"
            className="flex items-center justify-center w-full h-[60px] bg-[#B8962E] text-white font-semibold text-base tracking-wide hover:bg-[#9A7D25] transition-colors duration-200 shadow-[0_-2px_10px_rgba(0,0,0,0.15)]"
          >
            Request a Free Quote →
          </Link>
        </div>
      )}
    </>
  )
}
