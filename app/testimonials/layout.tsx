import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Testimonials | What Architects & Designers Say | Marbrest Stone',
  description: 'Hear from architects, interior designers, and hotel developers worldwide who trusted Marbrest Stone for their premium marble projects.',
  alternates: {
    canonical: 'https://www.marbreststone.com/testimonials',
  },
}

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
