import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Marbrest Stone | Specialists in Marble and Fine Stone Craftsmanship',
  description: 'Premium marble and fine stone craftsmanship for luxury projects worldwide. Discover our heritage, portfolio, and bespoke stone solutions.',
  keywords: 'marble, stone, luxury, craftsmanship, premium, bespoke',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
