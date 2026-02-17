'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden bg-charcoal">
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-charcoal z-10" />
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            // backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')`,
            backgroundImage: `url('/landing_page_image.png')`,
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-20 text-center px-6 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 tracking-tight">
            MARBREST <span className="text-gold">STONE</span>
          </h1>
          <div className="h-px w-32 bg-gold mx-auto mb-6" />
          <p
            className="text-xl md:text-2xl text-white font-medium tracking-wide"
            style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.7)' }}
          >
            Specialists in Marble and Fine Stone Craftsmanship
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center px-6 py-3 border-2 border-gold/60 bg-charcoal/40 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <p className="text-gold font-serif text-sm md:text-base tracking-widest uppercase">
                From the Mines of the Taj Mahal
              </p>
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)' }}
        >
          Transforming spaces with timeless elegance. Each piece tells a story of precision, 
          heritage, and unparalleled artistry.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <a
            href="/portfolio"
            className="inline-block px-10 py-4 bg-gold text-charcoal font-semibold tracking-wide hover:bg-gold-light transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            EXPLORE OUR WORK
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="text-white/60" size={32} />
        </motion.div>
      </motion.div>
    </section>
  )
}
