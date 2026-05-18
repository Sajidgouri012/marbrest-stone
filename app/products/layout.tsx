import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marble & Stone Products | Custom Flooring, Carvings & Handicrafts | Marbrest Stone',
  description: 'Browse our Makrana marble flooring, stone sinks, inlay work, temple carvings and more. Fully customizable. Export-ready. Request a quote today.',
  alternates: {
    canonical: 'https://www.marbreststone.com/products',
  },
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
