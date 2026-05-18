'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Play, X } from 'lucide-react'

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

export default function PortfolioClient({
  initialProjects,
  showCategories,
}: {
  initialProjects: Project[]
  showCategories: boolean
}) {
  const [projects] = useState<Project[]>(initialProjects)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)

  const categories = ['all', 'residential', 'commercial', 'hospitality', 'luxury']

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory)

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
              600+ Completed Projects Across Luxury Hotels, Residences & Sacred Spaces
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore our collection of luxury marble and stone installations from around the world
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {showCategories && (
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
          )}

          {/* Products CTA Banner */}
          <div className="mb-8 -mx-6 lg:-mx-8">
            <div className="py-12 px-6 lg:px-8 bg-gradient-to-br from-charcoal via-charcoal to-gray-900 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=1932&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-white mb-3 leading-tight">
                    Bring These Masterpieces to Your Space
                  </h2>
                  <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                    Premium stones, marble flooring, mosque & temple arts, carved handicrafts, and complete contract work for your projects
                  </p>
                  <motion.a
                    href="/products"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center px-8 py-3 bg-gold text-charcoal font-semibold tracking-wide hover:bg-gold-light transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    EXPLORE OUR PRODUCTS
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Craftsmanship CTA Banner */}
          <div className="mb-12 -mx-6 lg:-mx-8">
            <div className="py-10 px-6 lg:px-8 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border-y border-gold/20 relative overflow-hidden">
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 border border-gold/40 rounded-full mb-3">
                    <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gold font-semibold text-xs uppercase tracking-wider">Behind the Scenes</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-charcoal mb-2">
                    See How We Create These Masterpieces
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-5 max-w-2xl mx-auto">
                    Watch our skilled craftsmen at work — from raw stone to finished art
                  </p>
                  <motion.a
                    href="/craftsmanship"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center px-6 py-2.5 bg-charcoal text-white font-semibold tracking-wide hover:bg-gold hover:text-charcoal transition-all duration-300 group text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    VIEW OUR WORK PROCESS
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onVideoClick={setSelectedVideo}
                  onImageClick={(url, title) => setSelectedImage({ url, title })}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedVideo && (
        <VideoModal videoUrl={selectedVideo} onClose={() => setSelectedVideo(null)} getEmbedUrl={getVideoEmbedUrl} />
      )}

      {selectedImage && (
        <ImageModal imageUrl={selectedImage.url} title={selectedImage.title} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  )
}

function ProjectCard({
  project,
  index,
  onVideoClick,
  onImageClick,
}: {
  project: Project
  index: number
  onVideoClick: (url: string) => void
  onImageClick: (url: string, title: string) => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div
        className="relative h-80 overflow-hidden cursor-pointer"
        onClick={() => !project.video_url && onImageClick(project.image_url, project.title)}
      >
        <img
          src={project.image_url}
          alt={`${project.title} — marble installation by Marbrest Stone, ${project.location}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {project.video_url && (
          <>
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1.5 group-hover:opacity-0 transition-opacity duration-300">
              <Play size={14} className="text-white" fill="white" />
              <span className="text-white text-xs font-medium">Video</span>
            </div>
            <button
              onClick={() => onVideoClick(project.video_url!)}
              aria-label={`Play video for ${project.title}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-charcoal p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <Play size={24} fill="currentColor" />
            </button>
          </>
        )}
      </div>

      <div className="p-6">
        <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-2">{project.location}</div>
        <h3 className="text-xl font-serif font-bold text-charcoal mb-2">{project.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
      </div>
    </motion.div>
  )
}

function VideoModal({
  videoUrl,
  onClose,
  getEmbedUrl,
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
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gold transition-colors">
        <X size={32} />
      </button>
      <div className="relative w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={getEmbedUrl(videoUrl)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Marbrest Stone project video"
        />
      </div>
    </motion.div>
  )
}

function ImageModal({
  imageUrl,
  title,
  onClose,
}: {
  imageUrl: string
  title: string
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gold transition-colors z-10">
        <X size={32} />
      </button>
      <div className="relative flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={imageUrl}
          alt={`${title} — marble installation by Marbrest Stone`}
          className="max-w-full max-h-[calc(100vh-8rem)] object-contain"
        />
        <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-black/80 to-transparent p-4 rounded">
          <h3 className="text-white text-xl md:text-2xl font-serif font-bold">{title}</h3>
        </div>
      </div>
    </motion.div>
  )
}
