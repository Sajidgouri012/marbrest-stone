'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'Royal Palace Entrance',
    location: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2053&auto=format&fit=crop',
    description: 'Exquisite Calacatta marble installation with gold inlay detailing.',
  },
  {
    id: 2,
    title: 'Luxury Hotel Lobby',
    location: 'London, UK',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
    description: 'Floor-to-ceiling Statuario marble with custom lighting integration.',
  },
  {
    id: 3,
    title: 'Private Residence',
    location: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
    description: 'Bespoke kitchen countertops in rare Emperador marble.',
  },
  {
    id: 4,
    title: 'Corporate Headquarters',
    location: 'Singapore',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    description: 'Modern minimalist design with Nero Marquina and white Carrara.',
  },
]

export default function FeaturedProjects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  return (
    <section ref={ref} className="py-12 md:py-16 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Portfolio</span>
          <div className="h-px w-16 bg-gold mx-auto mt-2 mb-6" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most prestigious installations that showcase the pinnacle of stone craftsmanship
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[500px] md:h-[600px] rounded-sm overflow-hidden shadow-2xl"
          >
            <img
              src={projects[currentIndex].image}
              alt={projects[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">
                  {projects[currentIndex].location}
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                  {projects[currentIndex].title}
                </h3>
                <p className="text-gray-300 max-w-2xl">
                  {projects[currentIndex].description}
                </p>
              </motion.div>
            </div>
          </motion.div>

          <button
            onClick={prevProject}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-charcoal p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous project"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextProject}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-charcoal p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next project"
          >
            <ChevronRight size={24} />
          </button>

          <div className="flex justify-center mt-8 space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-gold' : 'w-2 bg-gray-400'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/portfolio"
            className="inline-block px-8 py-3 border-2 border-charcoal text-charcoal font-semibold tracking-wide hover:bg-charcoal hover:text-white transition-all duration-300"
          >
            VIEW ALL PROJECTS
          </a>
        </motion.div>
      </div>
    </section>
  )
}
