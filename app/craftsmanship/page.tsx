import { createClient } from '@/lib/supabase'
import CraftsmanshipClient from './CraftsmanshipClient'

const fallbackItems = [
  {
    id: '1',
    image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070',
    video_url: null,
    product_category: 'Temple',
    stone_type: 'White Marble',
    site_location: 'Jaipur',
    visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    image_url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070',
    video_url: null,
    product_category: 'Flooring',
    stone_type: 'Italian Marble',
    site_location: 'Delhi',
    visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2070',
    video_url: null,
    product_category: 'Temple',
    stone_type: 'Makrana Marble',
    site_location: 'Agra',
    visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070',
    video_url: null,
    product_category: 'Statue',
    stone_type: 'White Marble',
    site_location: 'Mumbai',
    visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    image_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070',
    video_url: null,
    product_category: 'Fountain',
    stone_type: 'Granite',
    site_location: 'Bangalore',
    visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    image_url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070',
    video_url: null,
    product_category: 'Flooring',
    stone_type: 'Marble',
    site_location: 'Chennai',
    visible: true,
    created_at: new Date().toISOString(),
  },
]

async function getItems() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('craftsmanship_items')
      .select('*')
      .eq('visible', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data && data.length > 0 ? data : fallbackItems
  } catch {
    return fallbackItems
  }
}

export default async function CraftsmanshipPage() {
  const items = await getItems()
  return <CraftsmanshipClient items={items} />
}
