import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Request a Free Project Consultation | Marbrest Stone',
  description: 'Tell us about your marble or stone project. We work with architects, developers, and international buyers. Response within 24 hours guaranteed.',
  alternates: {
    canonical: 'https://www.marbreststone.com/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
