'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Play, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Project {
  id: string
  title: string
  location: string
  description: string
  image_url: string
  video_url?: string
  category: string
  visible: boolean
  created_at: string
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const categories = ['all', 'residential', 'commercial', 'hospitality', 'luxury']

  // Fallback data in case database is not set up
  const fallbackProjects: Project[] = [
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

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Use database data if available, otherwise use fallback
      setProjects(data && data.length > 0 ? data : fallbackProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Use fallback data on error
      setProjects(fallbackProjects)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore our collection of luxury marble and stone installations from around the world
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 font-semibold tracking-wide uppercase text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gold text-charcoal'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
              <p className="mt-4 text-gray-600">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onVideoClick={setSelectedVideo}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedVideo && (
        <VideoModal
          videoUrl={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          getEmbedUrl={getVideoEmbedUrl}
        />
      )}
    </div>
  )
}

function ProjectCard({ 
  project, 
  index, 
  onVideoClick 
}: { 
  project: Project
  index: number
  onVideoClick: (url: string) => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {project.video_url && (
          <>
            {/* Subtle always-visible indicator */}
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1.5 group-hover:opacity-0 transition-opacity duration-300">
              <Play size={14} className="text-white" fill="white" />
              <span className="text-white text-xs font-medium">Video</span>
            </div>
            
            {/* Large play button on hover */}
            <button
              onClick={() => onVideoClick(project.video_url!)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-charcoal p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <Play size={24} fill="currentColor" />
            </button>
          </>
        )}
      </div>

      <div className="p-6">
        <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">
          {project.location}
        </div>
        <h3 className="text-xl font-serif font-bold text-charcoal mb-2">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  )
}

function VideoModal({ 
  videoUrl, 
  onClose, 
  getEmbedUrl 
}: { 
  videoUrl: string
  onClose: () => void
  getEmbedUrl: (url: string) => string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gold transition-colors"
      >
        <X size={32} />
      </button>
      
      <div 
        className="relative w-full max-w-5xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={getEmbedUrl(videoUrl)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </motion.div>
  )
}
