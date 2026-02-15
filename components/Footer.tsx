'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Portfolio', 'Products', 'Testimonials', 'Contact'].map((item) => (
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
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <span>info@marbreststone.com</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span>+91 8000485312</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400 text-sm">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>International Inquiries Welcome</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Business Hours</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
              <li>Saturday: 10:00 AM - 4:00 PM</li>
              <li>Sunday: By Appointment</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Marbrest Stone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
