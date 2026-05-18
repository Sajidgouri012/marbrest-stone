'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#1A1A1A]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1932&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Mobile: centered single-column | Desktop: two-column */}
      <div className="relative z-10 container">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          {/* Left: heading + subtext */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left lg:max-w-xl"
          >
            <h2 className="font-serif font-bold text-white mb-4 leading-tight">
              Ready to Transform Your Space?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Let's discuss your vision. Our team of experts is ready to bring your dream project
              to life with unparalleled craftsmanship and attention to detail.
            </p>
          </motion.div>

          {/* Right: CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex flex-col items-center lg:items-end gap-4"
          >
            {/* Primary CTA — full width on mobile */}
            <a
              href="/contact"
              className="flex items-center justify-center w-full lg:w-auto px-10 py-4 bg-[#B8962E] text-white font-semibold text-base rounded-md hover:bg-[#9A7D25] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Project
            </a>

            {/* Trust micro-copy */}
            <p className="text-gray-400 text-sm text-center">
              ✓ Free Consultation&nbsp;&nbsp;✓ 24hr Response&nbsp;&nbsp;✓ No Commitment
            </p>

            {/* Secondary text link */}
            <a
              href="/portfolio"
              className="text-gray-400 hover:text-white text-sm underline underline-offset-2 transition-colors"
            >
              View our portfolio first →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
