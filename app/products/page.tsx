import { createClient } from '@/lib/supabase'
import ProductsClient from './ProductsClient'

const fallbackCategories = [
  { id: '1', name: 'Fountains', slug: 'fountains', description: '', display_order: 1, visible: true },
  { id: '2', name: 'Home Temples', slug: 'home-temples', description: '', display_order: 2, visible: true },
  { id: '3', name: 'Flooring', slug: 'flooring', description: '', display_order: 3, visible: true },
  { id: '4', name: 'Mosque Work', slug: 'mosque-work', description: '', display_order: 4, visible: true },
  { id: '5', name: 'Coffee Tables', slug: 'coffee-tables', description: '', display_order: 5, visible: true },
  { id: '6', name: 'Dining Tables', slug: 'dining-tables', description: '', display_order: 6, visible: true },
  { id: '7', name: 'Wash Basin', slug: 'wash-basin', description: '', display_order: 7, visible: true },
  { id: '8', name: 'Bottle Stands', slug: 'bottle-stands', description: '', display_order: 8, visible: true },
  { id: '9', name: 'Home Decor', slug: 'home-decor', description: '', display_order: 9, visible: true },
  { id: '10', name: 'Other', slug: 'other', description: '', display_order: 10, visible: true },
]

const fallbackProducts = [
  {
    id: '1',
    name: 'Marble Garden Fountain',
    description: 'Elegant hand-carved marble fountain perfect for gardens and courtyards.',
    image_url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2070&auto=format&fit=crop',
    product_category_id: '1',
    origin: 'Makrana, Rajasthan',
    features: ['Hand Carved', 'Weather Resistant', 'Custom Sizes', 'Traditional Design'],
    customizable: true,
    visible: true,
    price_type: 'quote' as const,
  },
  {
    id: '2',
    name: 'Traditional Home Temple',
    description: 'Sacred marble temple for home worship with intricate carvings.',
    image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
    product_category_id: '2',
    origin: 'India',
    features: ['Handcrafted', 'Sacred Design', 'Multiple Sizes', 'Custom Engravings'],
    customizable: true,
    visible: true,
    price_type: 'quote' as const,
  },
  {
    id: '3',
    name: 'Premium Marble Flooring',
    description: 'Luxurious marble flooring tiles in various sizes and finishes.',
    image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
    product_category_id: '3',
    origin: 'Multiple Origins',
    features: ['Multiple Sizes', 'Various Finishes', 'Easy Installation', 'Bulk Available'],
    customizable: true,
    visible: true,
    price_type: 'range' as const,
    min_price: 150,
    max_price: 400,
    price_unit: 'per sq ft',
  },
  {
    id: '4',
    name: 'Luxury Marble Coffee Table',
    description: 'Stunning marble coffee table with elegant design.',
    image_url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2053&auto=format&fit=crop',
    product_category_id: '5',
    origin: 'Italy',
    features: ['Modern Design', 'Durable', 'Custom Sizes', 'Premium Finish'],
    customizable: true,
    visible: true,
    price_type: 'quote' as const,
  },
  {
    id: '5',
    name: 'Marble Dining Table',
    description: 'Elegant marble dining table with custom base options.',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    product_category_id: '6',
    origin: 'India',
    features: ['Custom Sizes', 'Multiple Marble Options', 'Luxury Finish', 'Durable'],
    customizable: true,
    visible: true,
    price_type: 'quote' as const,
  },
  {
    id: '6',
    name: 'Designer Marble Wash Basin',
    description: 'Handcrafted marble wash basin with modern design.',
    image_url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop',
    product_category_id: '7',
    origin: 'Makrana, Rajasthan',
    features: ['Handcrafted', 'Water Resistant', 'Custom Design', 'Premium Quality'],
    customizable: true,
    visible: true,
    price_type: 'quote' as const,
  },
]

async function getData() {
  try {
    const supabase = createClient()

    const [settingsResult, categoriesResult, productsResult] = await Promise.all([
      supabase.from('settings').select('*').eq('key', 'show_product_categories').single(),
      supabase.from('products_categories').select('*').eq('visible', true).order('display_order', { ascending: true }),
      supabase.from('products').select('*, product_category:products_categories(*)').eq('visible', true),
    ])

    const showCategories = settingsResult.data?.value === 'true'

    const categories =
      categoriesResult.data && categoriesResult.data.length > 0
        ? categoriesResult.data
        : fallbackCategories

    const rawProducts = productsResult.data || []
    const sortedProducts = rawProducts.sort((a: any, b: any) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    const products = sortedProducts.length > 0 ? sortedProducts : fallbackProducts

    return { products, categories, showCategories }
  } catch {
    return { products: fallbackProducts, categories: fallbackCategories, showCategories: true }
  }
}

export default async function ProductsPage() {
  const { products, categories, showCategories } = await getData()

  const productSchemas = products.slice(0, 20).map((product: any) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url,
    brand: {
      '@type': 'Brand',
      name: 'Marbrest Stone',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      seller: {
        '@type': 'Organization',
        name: 'Marbrest Stone',
      },
    },
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemas) }}
      />
      <ProductsClient
        initialProducts={products}
        initialCategories={categories}
        initialShowCategories={showCategories}
      />
    </>
  )
}
