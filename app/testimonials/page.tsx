'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import { createClient } from '@/lib/supabase'

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

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  // Fallback data in case database is not set up
  const fallbackTestimonials: Testimonial[] = [
    {
      id: '1',
      client_name: 'James Anderson',
      client_title: 'CEO',
      company: 'Anderson Luxury Homes',
      content: 'Working with Marbrest Stone was an absolute pleasure. Their attention to detail and commitment to quality is unmatched. The marble installation in our flagship property exceeded all expectations.',
      rating: 5,
      project_type: 'luxury',
      visible: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      client_name: 'Sarah Mitchell',
      client_title: 'Project Manager',
      company: 'Four Seasons Hotels',
      content: 'The team at Marbrest Stone delivered exceptional craftsmanship for our hotel lobby renovation. Their expertise in handling rare marble varieties and meeting tight deadlines was impressive.',
      rating: 5,
      project_type: 'hospitality',
      visible: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      client_name: 'David Chen',
      client_title: 'Interior Designer',
      company: 'Chen Design Studio',
      content: 'I have worked with many stone suppliers, but Marbrest Stone stands out for their professionalism and quality. They transformed our client\'s vision into reality with stunning marble work.',
      rating: 5,
      project_type: 'residential',
      visible: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '4',
      client_name: 'Mohammed Al-Rashid',
      client_title: 'Property Developer',
      company: 'Al-Rashid Developments',
      content: 'The Makrana marble from Marbrest Stone added unparalleled elegance to our luxury villas. Their knowledge of stone selection and installation techniques is truly world-class.',
      rating: 5,
      project_type: 'luxury',
      visible: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '5',
      client_name: 'Emily Rodriguez',
      client_title: 'Architect',
      company: 'Rodriguez & Partners',
      content: 'From initial consultation to final installation, Marbrest Stone demonstrated exceptional professionalism. The quality of their marble and craftsmanship is simply outstanding.',
      rating: 5,
      project_type: 'commercial',
      visible: true,
      created_at: new Date().toISOString(),
    },
    {
      id: '6',
      client_name: 'Robert Thompson',
      client_title: 'Homeowner',
      company: 'Private Client',
      content: 'Our kitchen and bathroom renovation with Marbrest Stone\'s marble exceeded our expectations. The attention to detail and the beauty of the stone transformed our home completely.',
      rating: 5,
      project_type: 'residential',
      visible: true,
      created_at: new Date().toISOString(),
    },
  ]

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('visible', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Use database data if available, otherwise use fallback
      setTestimonials(data && data.length > 0 ? data : fallbackTestimonials)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      // Use fallback data on error
      setTestimonials(fallbackTestimonials)
    } finally {
      setLoading(false)
    }
  }

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
              Client Testimonials
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Hear from our satisfied clients about their experience with Marbrest Stone
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
              <p className="mt-4 text-gray-600">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
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
  index 
}: { 
  testimonial: Testimonial
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

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
          "{testimonial.content}"
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
