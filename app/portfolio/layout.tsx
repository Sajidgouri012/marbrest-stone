import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marble Project Portfolio | Hotels, Residences & Mosques | Marbrest Stone',
  description: '600+ completed projects across luxury hotels, private residences, mosques and temples in 30+ countries. See our work and start your project.',
  alternates: {
    canonical: 'https://www.marbreststone.com/portfolio',
  },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
