'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-12 md:py-16 px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-charcoal" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1932&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Let's discuss your vision. Our team of experts is ready to bring your dream project to life 
            with unparalleled craftsmanship and attention to detail.
          </p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="/contact"
              className="group inline-flex items-center px-10 py-4 bg-gold text-charcoal font-semibold tracking-wide hover:bg-gold-light transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              START YOUR PROJECT
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            
            <a
              href="/portfolio"
              className="inline-block px-10 py-4 border-2 border-white text-white font-semibold tracking-wide hover:bg-white hover:text-charcoal transition-all duration-300"
            >
              VIEW PORTFOLIO
            </a>
          </motion.div>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 pt-16 border-t border-gray-700"
        >
          <p className="text-gray-400 text-sm mb-4">Trusted by luxury brands worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-white font-serif text-xl">RITZ-CARLTON</div>
            <div className="text-white font-serif text-xl">FOUR SEASONS</div>
            <div className="text-white font-serif text-xl">ARMANI</div>
            <div className="text-white font-serif text-xl">VERSACE</div>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}
