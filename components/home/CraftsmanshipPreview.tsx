'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Hammer, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CraftsmanshipPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const previewImages = [
    {
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800',
      title: 'Hand Carving',
      category: 'Crafting',
      alt: 'Master artisan hand carving white Makrana marble, Marbrest Stone workshop',
    },
    {
      url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800',
      title: 'Flooring Work',
      category: 'Installation',
      alt: 'Custom marble flooring installation for luxury hotel project by Marbrest Stone',
    },
    {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800',
      title: 'Temple Building',
      category: 'Construction',
      alt: 'Marble temple construction and stone carving, Rajasthan India by Marbrest Stone',
    },
    {
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
      title: 'Polishing',
      category: 'Finishing',
      alt: 'Final polishing of custom marble slab by Marbrest Stone craftsmen',
    },
  ]

  return (
    <section ref={ref} className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 fade-up"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B8962E]/10 border border-[#B8962E]/30 rounded-full mb-4">
            <Hammer className="text-[#B8962E]" size={18} />
            <span className="text-[#B8962E] font-semibold text-sm uppercase tracking-wider">Behind the Scenes</span>
          </div>

          <h2 className="font-serif font-bold text-charcoal mb-4">
            Witness Our <span className="text-[#B8962E]">Craftsmanship</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            See the dedication, skill, and artistry that goes into every piece. From raw stone to masterpiece,
            our craftsmen bring decades of experience to every project.
          </p>
        </motion.div>

        {/* Gallery grid — 2 col on mobile, 4 col on tablet+ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          {previewImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer fade-up"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                decoding="async"
              />

              {/* Gradient overlay — always visible on mobile, opacity shifts on hover for desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-70 md:opacity-50 group-hover:opacity-85 transition-opacity duration-300" />

              {/* Text — always visible on mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <div className="text-[10px] text-[#B8962E] font-semibold mb-0.5 uppercase tracking-wider">
                  {image.category}
                </div>
                <div className="text-xs md:text-sm font-bold">{image.title}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/craftsmanship"
            className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white font-semibold hover:bg-[#B8962E] transition-all duration-300 group rounded-md"
          >
            <Hammer size={20} />
            <span>See Our Work Process</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-3 text-sm text-gray-500">Watch videos and photos of our craftsmen at work</p>
        </motion.div>
      </div>
    </section>
  )
}
