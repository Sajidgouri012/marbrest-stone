'use client'

import { motion, useInView } from 'framer-motion'
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
    <div className="min-h-screen pt-20 pb-20 md:pb-0">
      {/* Hero */}
      <section className="py-16 md:py-20 bg-charcoal text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif font-bold mb-5">
              What Architects, Designers &amp; Developers Say About Marbrest Stone
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Hear from our satisfied clients about their experience with Marbrest Stone
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-14 md:py-20 bg-[#F8F5F0]">
        <div className="container">
          {testimonials.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No testimonials available yet.</p>
            </div>
          ) : (
            <>
              {/* CSS scroll-snap carousel — wraps to grid on ≥1024px */}
              <div className="testimonials-track">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    index={index}
                  />
                ))}
              </div>

              {/* Dot indicators — visible only on mobile */}
              <div className="flex justify-center gap-2 mt-5 md:hidden">
                {testimonials.slice(0, 8).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-300 first:bg-[#B8962E]"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1A1A1A] text-white">
        <div className="container text-center">
          <h2 className="font-serif font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Join hundreds of satisfied clients worldwide who trust Marbrest Stone for their luxury marble projects.
          </p>
          <a
            href="/contact"
            className="inline-block px-10 py-4 bg-[#B8962E] text-white font-semibold rounded-md hover:bg-[#9A7D25] transition-colors"
          >
            Request a Free Consultation
          </a>
          <p className="mt-4 text-gray-500 text-sm">✓ Free Consultation &nbsp;✓ 24hr Response &nbsp;✓ No Commitment</p>
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
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: Math.min(index * 0.07, 0.4) }}
      className="testimonial-card"
    >
      <div className="bg-white rounded-xl p-7 shadow-[0_2px_20px_rgba(0,0,0,0.07)] h-full flex flex-col relative">
        {/* Large quote watermark */}
        <div className="absolute top-5 right-5 text-[#B8962E]/15">
          <Quote size={44} />
        </div>

        {/* Stars */}
        <div className="flex gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < testimonial.rating ? 'text-[#B8962E] fill-[#B8962E]' : 'text-gray-300'}
            />
          ))}
        </div>

        {/* Quote text */}
        <p className="text-gray-700 leading-relaxed mb-6 flex-1 italic text-[1rem]">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author row */}
        <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
          {/* Avatar placeholder */}
          <div
            className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #B8962E, #9A7D25)' }}
          >
            {testimonial.client_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="font-serif font-bold text-charcoal text-sm truncate">
              {testimonial.client_name}
            </div>
            <div className="text-xs text-gray-500 truncate">{testimonial.client_title}</div>
            <div className="text-xs font-semibold text-[#B8962E] truncate">{testimonial.company}</div>
          </div>
        </div>

        {testimonial.project_type && (
          <div className="mt-3 text-[10px] text-gray-400 uppercase tracking-wider sm:tracking-widest">
            {testimonial.project_type}
          </div>
        )}
      </div>
    </motion.div>
  )
}
