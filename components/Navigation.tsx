'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/craftsmanship', label: 'Craftsmanship' },
    { href: '/products', label: 'Products' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-serif font-bold tracking-tight"
              >
                <span className="text-charcoal">MARBREST</span>
                <span className="text-gold ml-2">STONE</span>
              </motion.div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-charcoal hover:text-gold transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </Link>
              ))}

              {/* Request a Quote CTA */}
              <Link
                href="/contact"
                className="inline-block px-5 py-2.5 bg-[#B8962E] text-white font-semibold text-sm tracking-wide rounded-md hover:bg-[#a07d25] transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
                style={{ borderRadius: '6px' }}
              >
                Request a Quote
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-charcoal hover:text-gold transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-effect border-t border-gray-200"
            >
              <div className="px-6 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-base font-medium text-charcoal hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile menu CTA */}
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-5 py-3 bg-[#B8962E] text-white font-semibold text-sm tracking-wide rounded-md hover:bg-[#a07d25] transition-all duration-300 mt-2"
                >
                  Request a Quote
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile floating bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <Link
          href="/contact"
          className="block w-full text-center py-4 bg-[#B8962E] text-white font-semibold text-base tracking-wide hover:bg-[#a07d25] transition-colors duration-300 shadow-[0_-2px_10px_rgba(0,0,0,0.15)]"
        >
          Request a Quote
        </Link>
      </div>
    </>
  )
}
