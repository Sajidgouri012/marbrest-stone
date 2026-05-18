import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import FloatingElements from '@/components/FloatingElements'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.marbreststone.com'),
  title: 'Premium Makrana Marble & Custom Stone Craftsmanship | Marbrest Stone',
  description: 'Sourced from the mines of the Taj Mahal, Marbrest Stone delivers bespoke marble flooring, carvings, and stone exports to 30+ countries. Request a free consultation.',
  keywords: 'Makrana marble, marble flooring, stone craftsmanship, marble export, custom marble, Rajasthan marble, marble carvings, luxury marble',
  alternates: {
    canonical: 'https://www.marbreststone.com',
  },
  openGraph: {
    siteName: 'Marbrest Stone',
    locale: 'en_US',
    type: 'website',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Marbrest Stone',
  description: 'Premium Makrana marble and fine stone craftsmanship, exported worldwide.',
  url: 'https://www.marbreststone.com',
  telephone: '+918000485312',
  email: 'info@marbreststone.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Makrana',
    addressRegion: 'Rajasthan',
    postalCode: '342001',
    addressCountry: 'IN',
  },
  openingHours: ['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00'],
  areaServed: 'Worldwide',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Marble & Stone Products',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preload" href="/landing_page_image.png" as="image" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>
        <Navigation />
        {/* mobile-bottom-bar-offset adds pb-[60px] on mobile to prevent content hiding behind the sticky CTA bar */}
        <main className="min-h-screen mobile-bottom-bar-offset">
          {children}
        </main>
        <Footer />
        <FloatingElements />
      </body>
    </html>
  )
}
