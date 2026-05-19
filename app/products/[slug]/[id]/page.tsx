import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductDetailClient from './ProductDetailClient'

const BASE_URL = 'https://www.marbreststone.com'

export async function generateStaticParams() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('id, product_category:products_categories(slug)')
      .eq('visible', true)
    return (data ?? []).map((p: any) => ({
      slug: p.product_category?.slug ?? 'uncategorized',
      id: p.id,
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; id: string }
}): Promise<Metadata> {
  try {
    const supabase = createClient()
    const { data: product } = await supabase
      .from('products')
      .select('name, description, image_url')
      .eq('id', params.id)
      .single()

    if (!product) return { title: 'Product | Marbrest Stone' }

    return {
      title: `${product.name} | Marbrest Stone`,
      description:
        product.description?.slice(0, 160) ||
        `Premium marble product from Marbrest Stone. Crafted by master artisans from Makrana marble.`,
      alternates: { canonical: `${BASE_URL}/products/${params.slug}/${params.id}` },
      openGraph: {
        title: `${product.name} | Marbrest Stone`,
        description: product.description?.slice(0, 160),
        images: product.image_url ? [{ url: product.image_url }] : [],
        url: `${BASE_URL}/products/${params.slug}/${params.id}`,
        siteName: 'Marbrest Stone',
        type: 'website',
      },
    }
  } catch {
    return { title: 'Product | Marbrest Stone' }
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string; id: string }
}) {
  const supabase = createClient()

  const [productResult, relatedResult, categoryResult] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_category:products_categories(*)')
      .eq('id', params.id)
      .eq('visible', true)
      .single(),
    supabase
      .from('products')
      .select('id, name, image_url, origin, features, product_category_id, product_category:products_categories(*)')
      .eq('visible', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('products_categories')
      .select('*')
      .eq('slug', params.slug)
      .eq('visible', true)
      .single(),
  ])

  if (!productResult.data) notFound()

  const product = productResult.data
  const category = categoryResult.data ?? product.product_category

  /* Related: same category, exclude current */
  const related = (relatedResult.data ?? [])
    .filter((p: any) => p.product_category_id === product.product_category_id && p.id !== product.id)
    .slice(0, 4)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [product.image_url, ...(product.images ?? [])],
    brand: { '@type': 'Brand', name: 'Marbrest Stone' },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'INR',
      seller: { '@type': 'Organization', name: 'Marbrest Stone' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${BASE_URL}/products` },
      {
        '@type': 'ListItem',
        position: 3,
        name: category?.name ?? params.slug,
        item: `${BASE_URL}/products/${params.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${BASE_URL}/products/${params.slug}/${params.id}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient
        product={product}
        categorySlug={params.slug}
        relatedProducts={related as any[]}
      />
    </>
  )
}
