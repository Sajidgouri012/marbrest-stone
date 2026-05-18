'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">
              <span className="text-white">MARBREST</span>
              <span className="text-gold ml-2">STONE</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Specialists in Marble and Fine Stone Craftsmanship
            </p>
            <p className="text-gray-500 text-xs mt-3 leading-relaxed">
              Sourced from the legendary Makrana quarries that supplied the Taj Mahal — delivered worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Portfolio', 'Craftsmanship', 'Products', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-gray-400 hover:text-gold transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <Mail size={18} className="mt-0.5 flex-shrink-0 text-gold" />
                <a href="mailto:info@marbreststone.com" className="hover:text-gold transition-colors">
                  info@marbreststone.com
                </a>
              </li>
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <Phone size={18} className="mt-0.5 flex-shrink-0 text-gold" />
                <div className="space-y-0.5">
                  <a href="tel:+918000485312" className="block hover:text-gold transition-colors">+91 80004 85312</a>
                  <a href="tel:+918852821094" className="block hover:text-gold transition-colors">+91 88528 21094</a>
                  <a href="tel:+919952589286" className="block hover:text-gold transition-colors">+91 99525 89286</a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-gold" />
                <address className="not-italic leading-relaxed">
                  Marbrest Stone<br />
                  Makrana, Rajasthan — 341505<br />
                  India<br />
                  <span className="text-gold text-xs font-medium">Export Inquiries Welcome Worldwide</span>
                </address>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Business Hours</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Monday – Friday: 9:00 AM – 6:00 PM</li>
              <li>Saturday: 10:00 AM – 4:00 PM</li>
              <li>Sunday: By Appointment</li>
            </ul>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-block px-5 py-2.5 bg-[#B8962E] text-white font-semibold text-sm tracking-wide rounded-md hover:bg-[#a07d25] transition-all duration-300"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Marbrest Stone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
