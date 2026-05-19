import { createClient } from '@/lib/supabase'
import ProductsClient from './ProductsClient'

async function getData() {
  const supabase = createClient()

  const [settingsResult, categoriesResult, productsResult] = await Promise.all([
    supabase.from('settings').select('*').eq('key', 'show_product_categories').single(),
    supabase.from('products_categories').select('*').eq('visible', true).order('display_order', { ascending: true }),
    supabase.from('products').select('*, product_category:products_categories(*)').eq('visible', true),
  ])

  const showCategories = settingsResult.data?.value === 'true'
  const categories = categoriesResult.data ?? []

  const products = (productsResult.data ?? []).sort((a: any, b: any) => {
    const orderA = a.display_order ?? 999
    const orderB = b.display_order ?? 999
    if (orderA !== orderB) return orderA - orderB
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return { products, categories, showCategories }
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
