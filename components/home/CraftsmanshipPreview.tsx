'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Hammer, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

export default function CraftsmanshipPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const previewImages = [
    {
      url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800',
      title: 'Hand Carving',
      category: 'Crafting',
      alt: 'Master artisan hand carving white Makrana marble, Marbrest Stone workshop'
    },
    {
      url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800',
      title: 'Flooring Work',
      category: 'Installation',
      alt: 'Custom marble flooring installation for luxury hotel project by Marbrest Stone'
    },
    {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800',
      title: 'Temple Building',
      category: 'Construction',
      alt: 'Marble temple construction and stone carving, Rajasthan India by Marbrest Stone'
    },
    {
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
      title: 'Polishing',
      category: 'Finishing',
      alt: 'Final polishing of custom marble slab by Marbrest Stone craftsmen'
    }
  ]

  return (
    <section ref={ref} className="py-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-4">
            <Hammer className="text-gold" size={18} />
            <span className="text-gold font-semibold text-sm uppercase tracking-wider">Behind the Scenes</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-4">
            Witness Our <span className="text-gold">Craftsmanship</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See the dedication, skill, and artistry that goes into every piece. From raw stone to masterpiece, 
            our craftsmen bring decades of experience to every project.
          </p>
        </motion.div>

        {/* Preview Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {previewImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="text-xs text-gold font-semibold mb-1 uppercase tracking-wider">
                  {image.category}
                </div>
                <div className="text-sm font-bold">
                  {image.title}
                </div>
              </div>

              {/* Play Icon for Video Effect */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center">
                  <Play size={20} className="text-charcoal ml-0.5" fill="currentColor" />
                </div>
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
            className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white font-semibold hover:bg-gold hover:text-charcoal transition-all duration-300 group"
          >
            <Hammer size={20} />
            <span>See Our Work Process</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-4 text-sm text-gray-600">
            Watch videos and photos of our craftsmen at work
          </p>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-gold mb-1">50+</div>
            <div className="text-sm text-gray-600">Skilled Craftsmen</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-gold mb-1">30+</div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-gold mb-1">600+</div>
            <div className="text-sm text-gray-600">Projects Done</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-gold mb-1">100%</div>
            <div className="text-sm text-gray-600">Handcrafted</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
