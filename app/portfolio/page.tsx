import { createClient } from '@/lib/supabase'
import PortfolioClient from './PortfolioClient'

const fallbackProjects = [
  {
    id: '1',
    title: 'Royal Palace Entrance',
    location: 'Dubai, UAE',
    description: 'Exquisite Calacatta marble installation with gold inlay detailing.',
    image_url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2053&auto=format&fit=crop',
    video_url: '',
    category: 'luxury',
    visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Luxury Hotel Lobby',
    location: 'London, UK',
    description: 'Floor-to-ceiling Statuario marble with custom lighting integration.',
    image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
    video_url: '',
    category: 'hospitality',
    visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Private Residence',
    location: 'New York, USA',
    description: 'Bespoke kitchen countertops in rare Emperador marble.',
    image_url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
    video_url: '',
    category: 'residential',
    visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Corporate Headquarters',
    location: 'Singapore',
    description: 'Modern minimalist design with Nero Marquina and white Carrara.',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    video_url: '',
    category: 'commercial',
    visible: true,
    created_at: new Date().toISOString(),
  },
]

async function getData() {
  try {
    const supabase = createClient()

    const [settingsResult, projectsResult] = await Promise.all([
      supabase.from('settings').select('*').eq('key', 'show_portfolio_categories').single(),
      supabase
        .from('projects')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false }),
    ])

    const showCategories = settingsResult.data?.value === 'true'
    const projects =
      projectsResult.data && projectsResult.data.length > 0
        ? projectsResult.data
        : fallbackProjects

    return { projects, showCategories }
  } catch {
    return { projects: fallbackProjects, showCategories: true }
  }
}

export default async function PortfolioPage() {
  const { projects, showCategories } = await getData()
  return <PortfolioClient initialProjects={projects} showCategories={showCategories} />
}
