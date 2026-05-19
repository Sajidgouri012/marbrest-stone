import { createClient } from '@/lib/supabase'
import type { Metadata } from 'next'
import CatalogueClient from './CatalogueClient'

const BASE_URL = 'https://www.marbreststone.com'

export const metadata: Metadata = {
  title: 'Stone & Marble Catalogue | Premium Makrana Products | Marbrest Stone',
  description:
    'Browse our complete catalogue of premium Makrana marble — flooring, carvings, handicrafts, temple work and export products. Custom sizes, finishes. Download our PDF catalogue or request a quote.',
  alternates: { canonical: `${BASE_URL}/catalogue` },
  openGraph: {
    title: 'Stone & Marble Catalogue | Premium Makrana Products | Marbrest Stone',
    description: 'Browse our complete catalogue of premium Makrana marble — flooring, carvings, handicrafts, temple work and export products.',
    url: `${BASE_URL}/catalogue`,
    siteName: 'Marbrest Stone',
    type: 'website',
  },
}

const fallbackCategories = [
  { id: '1', name: 'Fountains', slug: 'fountains', description: 'Elegant marble fountains for gardens and courtyards', display_order: 1, visible: true },
  { id: '2', name: 'Home Temples', slug: 'home-temples', description: 'Sacred marble temples for home worship', display_order: 2, visible: true },
  { id: '3', name: 'Flooring', slug: 'flooring', description: 'Premium marble flooring tiles and slabs', display_order: 3, visible: true },
  { id: '4', name: 'Mosque Work', slug: 'mosque-work', description: 'Traditional Islamic marble artistry and installations', display_order: 4, visible: true },
  { id: '5', name: 'Home Decor', slug: 'home-decor', description: 'Marble home decor items and accessories', display_order: 9, visible: true },
]

const fallbackProducts = [
  {
    id: 'f1', name: 'Marble Garden Fountain', description: 'Elegant hand-carved marble fountain perfect for gardens and courtyards.',
    image_url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2070&auto=format&fit=crop',
    images: [], product_category_id: '1',
    product_category: { id: '1', name: 'Fountains', slug: 'fountains', description: '', display_order: 1, visible: true },
    origin: 'Makrana, Rajasthan', features: ['Hand Carved', 'Weather Resistant', 'Custom Sizes', 'Export Ready'],
    customizable: true, visible: true, price_type: 'quote' as const, created_at: new Date().toISOString(),
  },
  {
    id: 'f2', name: 'Traditional Home Temple', description: 'Sacred marble temple for home worship with intricate carvings.',
    image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
    images: [], product_category_id: '2',
    product_category: { id: '2', name: 'Home Temples', slug: 'home-temples', description: '', display_order: 2, visible: true },
    origin: 'India', features: ['Handcrafted', 'Sacred Design', 'Multiple Sizes', 'Custom Engravings'],
    customizable: true, visible: true, price_type: 'quote' as const, created_at: new Date().toISOString(),
  },
]

async function getData() {
  try {
    const supabase = createClient()
    const [categoriesResult, productsResult] = await Promise.all([
      supabase.from('products_categories').select('*').eq('visible', true).order('display_order', { ascending: true }),
      supabase.from('products').select('*, product_category:products_categories(*)').eq('visible', true).order('display_order', { ascending: true }),
    ])
    return {
      categories: categoriesResult.data && categoriesResult.data.length > 0 ? categoriesResult.data : fallbackCategories,
      products: productsResult.data && productsResult.data.length > 0 ? productsResult.data : fallbackProducts,
    }
  } catch {
    return { categories: fallbackCategories, products: fallbackProducts }
  }
}

const catalogueSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Marbrest Stone Product Catalogue',
  url: `${BASE_URL}/catalogue`,
  description: 'Complete catalogue of premium Makrana marble and stone products',
  provider: {
    '@type': 'Organization',
    name: 'Marbrest Stone',
    url: BASE_URL,
  },
}

export default async function CataloguePage() {
  const { categories, products } = await getData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogueSchema) }}
      />
      <CatalogueClient initialCategories={categories} initialProducts={products} />
    </>
  )
}
