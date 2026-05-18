'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Project {
  id: string
  title: string
  location: string
  image_url: string
  video_url?: string
  description: string
  category: string
}

export default function FeaturedProjects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('visible', true)
          .order('display_order', { ascending: true })
          .limit(5)

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const nextProject = () => {
    if (projects.length > 0) {
      setIsPlayingVideo(false)
      setCurrentIndex((prev) => (prev + 1) % projects.length)
    }
  }

  const prevProject = () => {
    if (projects.length > 0) {
      setIsPlayingVideo(false)
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
    }
  }

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be') 
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    return url
  }

  const toggleVideo = () => {
    setIsPlayingVideo(!isPlayingVideo)
  }

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container text-center">
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-gray-400">Loading projects...</div>
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <section ref={ref} id="portfolio" className="py-12 md:py-16 bg-gray-50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 fade-up"
        >
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">Portfolio</span>
          <div className="h-px w-16 bg-gold mx-auto mt-2 mb-6" />
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-charcoal mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most prestigious installations that showcase the pinnacle of stone craftsmanship
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-[500px] md:h-[600px] rounded-sm overflow-hidden shadow-2xl bg-black"
          >
            {isPlayingVideo && projects[currentIndex].video_url ? (
              <div className="relative w-full h-full">
                <iframe
                  src={getVideoEmbedUrl(projects[currentIndex].video_url!)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 z-10"
                  aria-label="Close video"
                >
                  <X size={24} />
                </button>
              </div>
            ) : (
              <>
                <img
                  src={projects[currentIndex].image_url}
                  alt={`${projects[currentIndex].title} — marble installation by Marbrest Stone, ${projects[currentIndex].location}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
                {projects[currentIndex].video_url && (
                  <button
                    onClick={toggleVideo}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold/90 hover:bg-gold text-charcoal p-6 rounded-full transition-all duration-300 hover:scale-110 shadow-2xl z-10"
                    aria-label="Play video"
                  >
                    <Play size={32} fill="currentColor" />
                  </button>
                )}
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="text-gold text-sm font-semibold tracking-widest uppercase mb-2">
                  {projects[currentIndex].location}
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                  {projects[currentIndex].title}
                </h3>
                <p className="text-gray-300 max-w-2xl">
                  {projects[currentIndex].description}
                </p>
              </motion.div>
            </div>
          </motion.div>

          <button
            onClick={prevProject}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-charcoal p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous project"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextProject}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-charcoal p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next project"
          >
            <ChevronRight size={24} />
          </button>

          {projects.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-gold' : 'w-2 bg-gray-400'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/portfolio"
            className="inline-block px-8 py-3 border-2 border-charcoal text-charcoal font-semibold tracking-wide hover:bg-charcoal hover:text-white transition-all duration-300 shadow-sm"
          >
            VIEW ALL PROJECTS
          </a>
        </motion.div>
      </div>
    </section>
  )
}
