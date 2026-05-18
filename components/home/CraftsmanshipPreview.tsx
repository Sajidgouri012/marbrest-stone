'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Hammer, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CraftsmanshipPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/craftsmanship"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#B8962E] text-white font-semibold text-base hover:bg-[#9A7D25] transition-all duration-300 group rounded-md shadow-lg hover:shadow-xl"
          >
            <Hammer size={22} />
            <span>See Our Work Process</span>
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">Watch videos and photos of our craftsmen at work</p>
        </motion.div>
      </div>
    </section>
  )
}
