import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase'

const BASE_URL = 'https://www.marbreststone.com'

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/products`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/portfolio`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/craftsmanship`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/testimonials`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const { data: categories } = await supabase
    .from('products_categories')
    .select('slug')
    .eq('visible', true)
    .order('display_order', { ascending: true })

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((cat) => ({
    url: `${BASE_URL}/products/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes]
}
