import { createClient } from '@/lib/supabase'
import TestimonialsClient from './TestimonialsClient'

const fallbackTestimonials = [
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
    content: "I have worked with many stone suppliers, but Marbrest Stone stands out for their professionalism and quality. They transformed our client's vision into reality with stunning marble work.",
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
    content: "Our kitchen and bathroom renovation with Marbrest Stone's marble exceeded our expectations. The attention to detail and the beauty of the stone transformed our home completely.",
    rating: 5,
    project_type: 'residential',
    visible: true,
    created_at: new Date().toISOString(),
  },
]

async function getTestimonials() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) throw error
    return data && data.length > 0 ? data : fallbackTestimonials
  } catch {
    return fallbackTestimonials
  }
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()

  const aggregateRatingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Marbrest Stone',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: String(testimonials.length),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />
      <TestimonialsClient testimonials={testimonials} />
    </>
  )
}
