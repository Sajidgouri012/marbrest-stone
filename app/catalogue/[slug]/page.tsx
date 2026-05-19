import { createClient } from '@/lib/supabase'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import CategoryClient from './CategoryClient'

const BASE_URL = 'https://www.marbreststone.com'

export async function generateStaticParams() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('products_categories')
      .select('slug')
      .eq('visible', true)
    return (data ?? []).map((cat) => ({ slug: cat.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const supabase = createClient()
    const { data: category } = await supabase
      .from('products_categories')
      .select('name, description')
      .eq('slug', params.slug)
      .eq('visible', true)
      .single()

    if (!category) return { title: 'Category | Marbrest Stone' }

    return {
      title: `${category.name} | Marble & Stone Catalogue | Marbrest Stone`,
      description: `Browse our complete ${category.name} collection — premium Makrana marble crafted by master artisans. Custom sizes and finishes. Export-ready. Request a quote today.`,
      alternates: { canonical: `${BASE_URL}/catalogue/${params.slug}` },
      openGraph: {
        title: `${category.name} | Marble & Stone Catalogue | Marbrest Stone`,
        url: `${BASE_URL}/catalogue/${params.slug}`,
        siteName: 'Marbrest Stone',
        type: 'website',
      },
    }
  } catch {
    return { title: 'Category | Marbrest Stone' }
  }
}

export default async function CatalogueCategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createClient()

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

  if (!categoryResult.data) {
    /* Unknown slug — redirect to main catalogue rather than 404 */
    redirect('/catalogue')
  }

  const category = categoryResult.data
  const allProducts = productsResult.data ?? []
  const catProducts = allProducts.filter(
    (p: any) => p.product_category_id === category.id
  )
  const allCategories = (allCategoriesResult.data ?? []).filter(
    (c: any) => c.id !== category.id
  )

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${BASE_URL}/catalogue` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/catalogue/${params.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryClient
        category={category}
        initialProducts={catProducts}
        allCategories={allCategories}
      />
    </>
  )
}
