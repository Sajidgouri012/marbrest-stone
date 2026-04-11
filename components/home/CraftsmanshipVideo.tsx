'use client'

import { motion } from 'framer-motion'
import { Play, Award, Hammer, Users } from 'lucide-react'
import { useState } from 'react'

export default function CraftsmanshipVideo() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal mb-6">
            Witness Our <span className="text-gold">Craftsmanship</span>
          </h2>
          <div className="h-px w-24 bg-gold mx-auto mb-6" />
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            From the legendary mines of Makrana to your space. Watch how we transform raw marble 
            into timeless masterpieces with precision and artistry.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          > */}
          <div className="relative aspect-video bg-charcoal rounded-sm overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-full"
              src="https://drive.google.com/file/d/1x4qj_UXGADoOITlAqfiOHZPGOYCWyphQ/preview"
              title="Craftsmanship Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
            {/* <div className="relative aspect-video bg-charcoal rounded-sm overflow-hidden shadow-2xl group">
              {!isPlaying ? (
                <>
                  <img
                    // src="https://images.unsplash.com/photo-1590642916589-592bca10dfbf?q=80&w=2070&auto=format&fit=crop"
                    src="/marbrest_logo.png"
                    alt="Marble craftsmanship"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/30 transition-all duration-300" />
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gold/90 hover:bg-gold rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-xl">
                      <Play className="text-charcoal ml-1" size={32} fill="currentColor" />
                    </div>
                  </button>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-serif text-xl md:text-2xl font-bold drop-shadow-lg">
                      See How We Craft Excellence
                    </p>
                  </div>
                </>
              ) : (
                <iframe
                  className="w-full h-full"
                  // src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&enablejsapi=1&modestbranding=1&rel=0&showinfo=0"
                  src="https://drive.google.com/file/d/1x4qj_UXGADoOITlAqfiOHZPGOYCWyphQ/preview"
                  title="Craftsmanship Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <Hammer className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
                  Handcrafted by Masters
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Every piece is meticulously crafted by our skilled artisans with decades of experience 
                  in marble work, ensuring unparalleled quality and precision.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <Award className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
                  Premium Makrana Marble
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Sourced directly from the same mines that supplied marble for the Taj Mahal, 
                  we offer the finest quality stone with exceptional durability and beauty.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <Users className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
                  Trusted Worldwide
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  From luxury hotels to private residences across 30+ countries, our work speaks 
                  for itself. Join hundreds of satisfied clients who chose excellence.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href="/portfolio"
                className="inline-block px-8 py-4 border-2 border-gold text-gold font-semibold tracking-wide hover:bg-gold hover:text-charcoal transition-all duration-300"
              >
                VIEW OUR PORTFOLIO
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          // For 4 divs
          // className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-gold mb-2">600+</div>
            <div className="text-gray-600 font-medium">Projects Completed</div>
          </div>
          {/* <div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-gold mb-2">30+</div>
            <div className="text-gray-600 font-medium">Countries Served</div>
          </div> */}
          <div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-gold mb-2">30+</div>
            <div className="text-gray-600 font-medium">Years Experience</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-gold mb-2">100%</div>
            <div className="text-gray-600 font-medium">Client Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
