import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Stone Craftsmanship Process | Handcrafted Marble by Master Artisans | Marbrest Stone',
  description: 'Watch our master craftsmen transform raw Makrana marble into bespoke installations. 50+ skilled artisans, 30+ years experience. See behind the scenes.',
  alternates: {
    canonical: 'https://www.marbreststone.com/craftsmanship',
  },
}

export default function CraftsmanshipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
