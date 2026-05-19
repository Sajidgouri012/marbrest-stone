'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Play, X, Eye, MapPin, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const categories = ['all', 'residential', 'commercial', 'hospitality', 'luxury']

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === selectedCategory)

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
              600+ Completed Projects Across Luxury Hotels, Residences & Sacred Spaces
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto">
              Explore our collection of luxury marble and stone installations from around the world
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Category filter */}
          {showCategories && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#B8962E] text-white shadow-md'
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white mb-3 leading-tight">
                    Bring These Masterpieces to Your Space
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-2xl mx-auto">
                    Premium stones, marble flooring, mosque & temple arts, carved handicrafts, and complete contract work
                  </p>
                  <a
                    href="/products"
                    className="inline-flex items-center px-8 py-3 bg-[#B8962E] text-white font-semibold tracking-wide hover:bg-[#9A7D25] transition-all duration-300 shadow-lg hover:shadow-xl group text-sm"
                  >
                    EXPLORE OUR PRODUCTS
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Project grid */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No projects found in this category.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Showing <span className="font-semibold text-charcoal">{filteredProjects.length}</span>{' '}
                {filteredProjects.length === 1 ? 'project' : 'projects'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Project detail modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  )
}

/* ── Project Card ─────────────────────────────────────────────────────────── */
function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project
  index: number
  onClick: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      onClick={onClick}
      className="group relative bg-white border border-gray-200 hover:border-[#B8962E] hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden rounded-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={project.image_url}
          alt={`${project.title} — marble installation by Marbrest Stone, ${project.location}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {project.video_url && (
            <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1">
              <Play size={10} className="text-white" fill="white" />
              <span className="text-white text-[10px] font-medium">VIDEO</span>
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <Eye size={18} />
            <span>View Details</span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        <p className="text-[10px] text-[#B8962E] font-semibold uppercase tracking-wider mb-1">{project.location}</p>
        <h3 className="font-semibold text-charcoal text-sm mb-1 line-clamp-2 group-hover:text-[#B8962E] transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{project.description}</p>
      </div>
    </motion.div>
  )
}

/* ── Project Detail Modal ─────────────────────────────────────────────────── */
function ProjectDetailModal({
  project,
  isOpen,
  onClose,
}: {
  project: Project
  isOpen: boolean
  onClose: () => void
}) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('youtu.be/')[1]?.split('?')[0]
        : url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    return url
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {/* Backdrop — anchors card to bottom on mobile, centres on sm+ */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        {/* Card — bottom sheet on mobile, centred card on desktop */}
        <motion.div
          key="card"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="bg-white w-full sm:max-w-4xl
                     rounded-t-2xl sm:rounded-2xl
                     shadow-2xl overflow-hidden
                     max-h-[92vh] sm:max-h-[88vh]
                     flex flex-col sm:flex-row
                     relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-charcoal" />
          </button>

          {/* Drag handle — mobile only */}
          <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Image — short banner on mobile, square half on desktop */}
          <div className="relative bg-gray-100 flex-shrink-0 h-44 sm:h-auto sm:w-1/2 sm:aspect-square">
            {isPlayingVideo && project.video_url ? (
              <div className="relative w-full h-full">
                <iframe
                  src={getVideoEmbedUrl(project.video_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${project.title} video`}
                />
                <button
                  onClick={() => setIsPlayingVideo(false)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors z-10"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={project.image_url}
                  alt={`${project.title} — marble installation by Marbrest Stone, ${project.location}`}
                  className="w-full h-full object-cover"
                />
                {project.video_url && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsPlayingVideo(true) }}
                    className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group"
                    aria-label="Play video"
                  >
                    <div className="bg-[#B8962E] text-white p-3 sm:p-4 rounded-full group-hover:scale-110 transition-transform shadow-xl">
                      <Play size={22} fill="currentColor" />
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Details panel — scrollable */}
          <div className="flex flex-col p-5 sm:p-6 overflow-y-auto flex-1 sm:w-1/2">
            {/* Location + category */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="flex items-center gap-1 text-[#B8962E] text-xs font-semibold uppercase tracking-wider">
                <MapPin size={12} />
                {project.location}
              </span>
              {project.category && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full capitalize">
                  {project.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-serif font-bold text-charcoal text-xl sm:text-2xl mb-4 leading-snug">
              {project.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              {project.description}
            </p>

            {/* Video hint */}
            {project.video_url && !isPlayingVideo && (
              <button
                onClick={() => setIsPlayingVideo(true)}
                className="flex items-center gap-2 text-xs font-semibold text-[#B8962E] hover:text-[#9A7D25] transition-colors mb-4"
              >
                <div className="w-6 h-6 rounded-full bg-[#B8962E]/10 flex items-center justify-center flex-shrink-0">
                  <Play size={11} fill="currentColor" className="text-[#B8962E]" />
                </div>
                Watch project video
              </button>
            )}

            {/* Push CTAs to bottom */}
            <div className="flex-1" />

            {/* CTAs */}
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <a
                href={`https://wa.me/918000485312?text=Hi%2C%20I%27m%20interested%20in%20a%20similar%20project%20to%20${encodeURIComponent(project.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-semibold text-sm rounded-md hover:bg-[#1daa54] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enquire on WhatsApp
              </a>
              <a
                href="/contact"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#B8962E] text-white font-semibold text-sm rounded-md hover:bg-[#9A7D25] transition-colors"
              >
                <Sparkles size={16} />
                Request a Similar Project
              </a>
              <p className="text-center text-xs text-gray-400">
                ✓ Free Consultation &nbsp;✓ 24hr Response &nbsp;✓ No Commitment
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
