'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  client_name: string
  client_title: string
  company: string
  content: string
  rating: number
  project_type: string
  visible: boolean
  created_at: string
}

export default function TestimonialsClient({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              What Architects, Designers & Developers Say About Marbrest Stone
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hear from our satisfied clients about their experience with Marbrest Stone
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {testimonials.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No testimonials available yet.</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="break-inside-avoid mb-8"
    >
      <div className="bg-white p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
        <div className="absolute top-6 right-6 text-gold/20">
          <Quote size={48} />
        </div>

        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < testimonial.rating ? 'text-gold fill-gold' : 'text-gray-300'}
            />
          ))}
        </div>

        <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        <div className="border-t border-gray-200 pt-4">
          <div className="font-serif font-bold text-charcoal mb-1">
            {testimonial.client_name}
          </div>
          <div className="text-sm text-gray-600">
            {testimonial.client_title}
          </div>
          <div className="text-sm text-gold font-semibold mt-1">
            {testimonial.company}
          </div>
          <div className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
            {testimonial.project_type}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
