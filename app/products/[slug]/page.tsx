import { createClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import CategoryProductsClient from './CategoryProductsClient'

const BASE_URL = 'https://www.marbreststone.com'

/* Per-category meta descriptions — keyed by exact slug in products_categories table */
const categoryMeta: Record<string, { title: string; description: string }> = {
  'marble-flooring': {
    title: 'Marble Flooring | Premium Makrana Marble Tiles & Slabs',
    description: 'Luxury Makrana marble flooring tiles and slabs for residential, commercial and hospitality projects. Hand-polished, export-ready. Request a free quote.',
  },
  'marble-counter-tops': {
    title: 'Marble Counter Tops | Kitchen & Bathroom Stone Tops',
    description: 'Premium Makrana marble counter tops for kitchens and bathrooms. Custom cut, polished, and export-ready. Durable, elegant, and heat-resistant.',
  },
  'stone-inlay-work': {
    title: 'Stone Inlay Work | Pietra Dura & Marble Inlay Art',
    description: 'Intricate stone inlay work (Pietra Dura) in the tradition of the Taj Mahal. Custom marble inlay flooring, panels, tabletops, and wall art.',
  },
  'marble-wash-basins': {
    title: 'Marble Wash Basins | Handcrafted Stone Sinks',
    description: 'Luxury handcrafted marble wash basins and stone sinks for bathrooms and powder rooms. Custom shapes, finishes, and sizes. Export worldwide.',
  },
  'mosque-marble-work': {
    title: 'Mosque Marble Work | Islamic Stone Artistry',
    description: 'Bespoke marble work for mosques and Islamic architecture. Mihrab panels, flooring, calligraphy carvings, and full interior marble installations.',
  },
  'home-temple-marble-work': {
    title: 'Home Temples & Religious Artistry | Sacred Marble Work',
    description: 'Custom marble home temples, idols, and religious artistry. Hand-carved mandirs and ceremonial stonework by Marbrest Stone craftsmen.',
  },
  'marble-home-decor': {
    title: 'Marble Home Decor | Luxury Stone Accessories',
    description: 'Premium marble home decor accessories for luxury interiors. Candle holders, trays, bookends, planters, and custom decorative stonework.',
  },
  'marble-fountains': {
    title: 'Marble Fountains | Hand-Carved Stone Water Features',
    description: 'Custom hand-carved marble fountains for gardens, courtyards, hotels, and villas. Made from Makrana marble. Export-ready to 30+ countries.',
  },
  'marble-coffee-tables': {
    title: 'Marble Coffee Tables | Luxury Stone Furniture',
    description: 'Handcrafted Makrana marble coffee tables for luxury living rooms. Custom sizes, bases, and edge profiles. Worldwide shipping available.',
  },
  'marble-dining-tables': {
    title: 'Marble Dining Tables | Luxury Stone Furniture',
    description: 'Statement Makrana marble dining tables for luxury homes, restaurants, and hospitality projects. Custom dimensions, base options, and finishes.',
  },
}

/* ─── generateMetadata ───────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const supabase = createClient()
  const { data: category } = await supabase
    .from('products_categories')
    .select('name, description')
    .eq('slug', params.slug)
    .eq('visible', true)
    .single()

  if (!category) {
    return { title: 'Category Not Found | Marbrest Stone' }
  }

  const meta = categoryMeta[params.slug] ?? {
    title: `${category.name} | Marbrest Stone`,
    description:
      category.description ||
      `Premium ${category.name} crafted from Makrana marble by Marbrest Stone. Exported to 30+ countries. Request a free quote.`,
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${BASE_URL}/products/${params.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${BASE_URL}/products/${params.slug}`,
      siteName: 'Marbrest Stone',
      type: 'website',
    },
  }
}

/* ─── Page (Server Component) ───────────────────────────────────────────── */
export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

  /* Fetch category, its products, and all visible categories in parallel */
  const [categoryResult, productsResult, allCategoriesResult] = await Promise.all([
    supabase
      .from('products_categories')
      .select('*')
      .eq('slug', params.slug)
      .eq('visible', true)
      .single(),
    supabase
      .from('products')
      .select('*, product_category:products_categories(*)')
      .eq('visible', true)
      .order('display_order', { ascending: true }),
    supabase
      .from('products_categories')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true }),
  ])

  const category = categoryResult.data
  if (!category) notFound()

  /* Filter products to this category only */
  const products = (productsResult.data ?? []).filter(
    (p: any) => p.product_category_id === category.id
  )

  const allCategories = allCategoriesResult.data ?? []

  /* ── Structured data ──────────────────────────────────────────────────── */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${BASE_URL}/products` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/products/${params.slug}` },
    ],
  }

  const productListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} — Marbrest Stone`,
    url: `${BASE_URL}/products/${params.slug}`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        description: p.description,
        image: p.image_url,
        brand: { '@type': 'Brand', name: 'Marbrest Stone' },
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          priceCurrency: 'INR',
          seller: { '@type': 'Organization', name: 'Marbrest Stone' },
        },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
      />
      <CategoryProductsClient
        category={category}
        initialProducts={products}
        allCategories={allCategories}
        currentSlug={params.slug}
      />
    </>
  )
}
