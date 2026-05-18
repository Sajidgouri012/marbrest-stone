'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, ChevronDown } from 'lucide-react'

const quickLinks = ['Home', 'Portfolio', 'Craftsmanship', 'Products', 'Testimonials', 'Contact']

const businessHours = [
  'Monday – Friday: 9:00 AM – 6:00 PM',
  'Saturday: 10:00 AM – 4:00 PM',
  'Sunday: By Appointment',
]

function AccordionSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-gray-800 md:border-0">
      {/* Mobile: accordion header */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden w-full flex items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-serif text-white text-base font-semibold">{title}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Desktop: always visible heading */}
      <h4 className="hidden md:block font-serif text-lg text-white mb-4">{title}</h4>

      {/* Content — accordion on mobile, always visible on md+ */}
      <div
        className={`overflow-hidden md:overflow-visible transition-all duration-300 md:max-h-none ${
          open ? 'max-h-96 pb-4' : 'max-h-0 md:max-h-none'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function BackToTop() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollTop}
      className="flex items-center gap-2 text-gray-400 hover:text-[#B8962E] transition-colors text-sm mx-auto md:mx-0"
      aria-label="Back to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      <span>Back to top</span>
    </button>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1A1A1A] text-white" style={{ borderTop: '3px solid #B8962E' }}>
      <div className="container py-12 md:py-16">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-12">
          {/* Brand column — always visible */}
          <div className="py-6 md:py-0 border-b border-gray-800 md:border-0">
            <h3 className="text-2xl font-serif font-bold mb-3">
              <span className="text-white">MARBREST</span>
              <span className="text-[#B8962E] ml-2">STONE</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              Specialists in Marble and Fine Stone Craftsmanship
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Sourced from the legendary Makrana quarries that supplied the Taj Mahal — delivered worldwide.
            </p>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/918000485312?text=Hi%2C%20I%27m%20interested%20in%20a%20marble%20project"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-[#25D366] text-white text-sm font-semibold rounded-md hover:bg-[#1daa54] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <AccordionSection title="Quick Links">
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-[#B8962E] transition-colors text-sm block py-0.5"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>

          {/* Contact */}
          <AccordionSection title="Contact">
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-[#B8962E]" />
                <a href="mailto:info@marbreststone.com" className="hover:text-[#B8962E] transition-colors">
                  info@marbreststone.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-[#B8962E]" />
                <div className="space-y-1">
                  <a href="tel:+918000485312" className="block hover:text-[#B8962E] transition-colors">+91 80004 85312</a>
                  <a href="tel:+918852821094" className="block hover:text-[#B8962E] transition-colors">+91 88528 21094</a>
                  <a href="tel:+919952589286" className="block hover:text-[#B8962E] transition-colors">+91 99525 89286</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#B8962E]" />
                <address className="not-italic leading-relaxed">
                  Makrana, Rajasthan — 341505<br />
                  India<br />
                  <span className="text-[#B8962E] text-xs font-medium">Export Inquiries Welcome Worldwide</span>
                </address>
              </li>
            </ul>
          </AccordionSection>

          {/* Business Hours */}
          <AccordionSection title="Business Hours">
            <ul className="space-y-2 text-gray-400 text-sm">
              {businessHours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <div className="mt-5">
              <Link
                href="/contact"
                className="inline-block px-5 py-2.5 bg-[#B8962E] text-white font-semibold text-sm rounded-md hover:bg-[#9A7D25] transition-colors"
              >
                Request a Quote
              </Link>
            </div>
          </AccordionSection>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            &copy; {currentYear} Marbrest Stone. All rights reserved.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  )
}
