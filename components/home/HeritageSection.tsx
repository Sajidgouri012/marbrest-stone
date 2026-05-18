'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function HeritageSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-12 md:py-16 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="text-gold text-sm font-semibold tracking-widest uppercase">Our Heritage</span>
              <div className="h-px w-16 bg-gold mt-2" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-6 leading-tight">
              Crafting Excellence Since Generations
            </h2>
            
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                At Marbrest Stone, we don't just work with marble and stone—we breathe life into them. 
                Our journey began with a simple belief: that every surface deserves to be a masterpiece.
              </p>
              <p>
                With decades of experience and an unwavering commitment to quality, we've become the 
                trusted name for luxury projects worldwide. From grand hotels to intimate residences, 
                our craftsmanship speaks for itself.
              </p>
              <p>
                Each slab is carefully selected, each cut precisely measured, and each installation 
                executed with meticulous attention to detail. This is not just our work—it's our legacy.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 grid grid-cols-3 gap-8"
            >
              <div>
                <div className="text-4xl font-serif font-bold text-gold mb-2">600+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Projects</div>
              </div>
              {/* <div>
                <div className="text-4xl font-serif font-bold text-gold mb-2">30+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Countries</div>
              </div> */}
              <div>
                <div className="text-4xl font-serif font-bold text-gold mb-2">30+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Years Experience</div>
              </div>
              <div>
                <div className="text-4xl font-serif font-bold text-gold mb-2">100%</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[700px] w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent rounded-sm" />
              <img
                src="/crafting_sectioin_image.png"
                alt="Master artisan hand carving white Makrana marble, Marbrest Stone workshop, Rajasthan India"
                className="w-full h-full object-contain rounded-sm shadow-2xl"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-charcoal rounded-sm -z-10" />
              <div className="absolute -top-6 -left-6 w-48 h-48 border-2 border-gold rounded-sm -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
