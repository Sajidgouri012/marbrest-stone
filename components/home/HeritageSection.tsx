'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function HeritageSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="about" className="py-16 md:py-24 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="text-[#B8962E] text-sm font-semibold tracking-widest uppercase">Our Heritage</span>
              <div className="h-px w-16 bg-[#B8962E] mt-2" />
            </div>

            <h2 className="font-serif font-bold text-charcoal mb-6 leading-tight">
              Crafting Excellence Since Generations
            </h2>

            <div className="space-y-4 text-gray-700">
              <p>
                At Marbrest Stone, we don't just work with marble and stone — we breathe life into them.
                Our journey began with a simple belief: that every surface deserves to be a masterpiece.
              </p>
              <p>
                With decades of experience and an unwavering commitment to quality, we've become the
                trusted name for luxury projects worldwide. From grand hotels to intimate residences,
                our craftsmanship speaks for itself.
              </p>
              <p>
                Each slab is carefully selected, each cut precisely measured, and each installation
                executed with meticulous attention to detail. This is not just our work — it's our legacy.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href="/portfolio"
                className="inline-block px-7 py-3 bg-[#B8962E] text-white font-semibold rounded-md hover:bg-[#9A7D25] transition-colors"
              >
                View Our Work
              </a>
              <a
                href="/contact"
                className="inline-block px-7 py-3 border-2 border-charcoal text-charcoal font-semibold rounded-md hover:bg-charcoal hover:text-white transition-colors"
              >
                Get in Touch
              </a>
            </motion.div>
          </motion.div>

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full" style={{ maxHeight: '600px' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#B8962E]/20 to-transparent rounded-sm z-10 pointer-events-none" />
              <img
                src="/crafting_sectioin_image.png"
                alt="Master artisan hand carving white Makrana marble, Marbrest Stone workshop, Rajasthan India"
                className="w-full h-full object-contain rounded-sm shadow-2xl"
                style={{ maxHeight: '600px' }}
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-charcoal rounded-sm -z-10 hidden sm:block" />
              <div className="absolute -top-4 -left-4 w-32 h-32 border-2 border-[#B8962E] rounded-sm -z-10 hidden sm:block" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
