'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex items-center justify-center overflow-hidden bg-charcoal"
      style={{ minHeight: '100svh' }}
    >
      {/* Background parallax image */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal z-10" />
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('/landing_page_image.png')` }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 w-full px-5 md:px-10 lg:px-16 py-24 lg:py-0
          text-center
          md:text-left
          max-w-5xl mx-auto
          flex flex-col items-center
          md:items-start"
      >
        {/* 1. Label tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-5"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 border border-[#B8962E]/60 bg-charcoal/40 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-[#B8962E] rounded-full animate-pulse" />
            <span
              className="text-[#B8962E] font-sans font-semibold uppercase tracking-[0.15em]"
              style={{ fontSize: '0.75rem' }}
            >
              From the Mines of the Taj Mahal
            </span>
            <span className="w-1.5 h-1.5 bg-[#B8962E] rounded-full animate-pulse" />
          </span>
        </motion.div>

        {/* 2. H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="text-white font-serif font-bold leading-tight mb-5 max-w-3xl"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.6)' }}
        >
          Premium Makrana Marble &amp; Custom Stone Craftsmanship —{' '}
          <span className="text-[#B8962E]">Exported to 30+ Countries</span>
        </motion.h1>

        {/* 3. Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-gray-200 max-w-xl mb-7 leading-relaxed"
          style={{ fontSize: '1rem', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
        >
          From the same legendary quarries that supplied the Taj Mahal — delivering bespoke marble
          flooring, sacred space installations, and stone export solutions worldwide.
        </motion.p>

        {/* 4. Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mb-9"
        >
          {[
            { value: '600+', label: 'Projects' },
            { value: '30+', label: 'Years' },
            { value: '30+', label: 'Countries' },
          ].map((badge, i) => (
            <span
              key={i}
              className="flex items-center gap-2 text-white/80 text-sm"
            >
              {i > 0 && <span className="text-[#B8962E]/60 hidden sm:inline">|</span>}
              <span className="font-bold text-[#B8962E]">{badge.value}</span>
              <span>{badge.label}</span>
            </span>
          ))}
        </motion.div>

        {/* 5 & 6. CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <a
            href="/contact"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-[#B8962E] text-white font-semibold text-base rounded-md hover:bg-[#9A7D25] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Request Free Consultation
          </a>

          <a
            href="/portfolio"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-white font-semibold text-base rounded-md hover:bg-white hover:text-charcoal transition-all duration-200 shadow-lg"
          >
            View Our Portfolio
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-white/50 text-xs uppercase tracking-[0.2em] font-sans">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white/50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
