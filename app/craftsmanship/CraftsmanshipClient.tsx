'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, X, Hammer, Users, Award, Clock } from 'lucide-react'

interface CraftsmanshipItem {
  id: string
  image_url: string
  video_url?: string | null
  product_category?: string | null
  stone_type?: string | null
  site_location?: string | null
  visible: boolean
  created_at: string
}

export default function CraftsmanshipClient({ items }: { items: CraftsmanshipItem[] }) {
  const [selectedMedia, setSelectedMedia] = useState<CraftsmanshipItem | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      item.product_category?.toLowerCase().includes(query) ||
      item.stone_type?.toLowerCase().includes(query) ||
      item.site_location?.toLowerCase().includes(query)
    )
  })

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
      {/* Hero Section */}
      <section className="relative py-24 px-6 lg:px-8 bg-gradient-to-br from-charcoal via-charcoal to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] bg-repeat" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 border border-gold/40 rounded-full mb-6">
              <Hammer className="text-gold" size={20} />
              <span className="text-gold font-semibold text-sm">Behind the Scenes</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
              Master Craftsmanship: From Makrana Quarry to Your Project
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Witness the dedication, skill, and artistry that goes into every piece we create.
              From raw stone to masterpiece.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center">
                <Users className="text-gold mx-auto mb-2" size={32} />
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-gray-400">Skilled Craftsmen</div>
              </div>
              <div className="text-center">
                <Award className="text-gold mx-auto mb-2" size={32} />
                <div className="text-3xl font-bold text-white mb-1">30+</div>
                <div className="text-sm text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <Hammer className="text-gold mx-auto mb-2" size={32} />
                <div className="text-3xl font-bold text-white mb-1">600+</div>
                <div className="text-sm text-gray-400">Projects Completed</div>
              </div>
              <div className="text-center">
                <Clock className="text-gold mx-auto mb-2" size={32} />
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-gray-400">Handcrafted</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search/Filter Section */}
      <section className="py-6 px-6 lg:px-8 bg-gray-50 border-b border-gray-200 sticky top-20 z-30">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by category, stone type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-gold focus:border-gold transition-all text-base"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-center text-sm text-gray-600 mt-2">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No content available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedMedia(item)}
                  className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={item.image_url}
                      alt={`${item.product_category || 'Stone work'} — ${item.stone_type || 'marble'} craftsmanship by Marbrest Stone${item.site_location ? ', ' + item.site_location : ''}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />

                    {item.video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Play size={28} className="text-charcoal ml-1" fill="currentColor" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-5">
                    {item.product_category && (
                      <div className="inline-block px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full mb-2 uppercase">
                        {item.product_category}
                      </div>
                    )}
                    <div className="space-y-1">
                      {item.stone_type && (
                        <p className="text-sm font-semibold text-charcoal">{item.stone_type}</p>
                      )}
                      {item.site_location && (
                        <p className="text-sm text-gray-600">📍 {item.site_location}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-charcoal to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Ready to Start Your <span className="text-gold">Project?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience the same dedication and craftsmanship for your custom marble work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-10 py-4 bg-gold text-charcoal font-semibold tracking-wide hover:bg-gold-light transition-all duration-300"
              >
                GET A QUOTE
              </a>
              <a
                href="/products"
                className="inline-block px-10 py-4 border-2 border-white text-white font-semibold tracking-wide hover:bg-white hover:text-charcoal transition-all duration-300"
              >
                VIEW PRODUCTS
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Media Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={() => setSelectedMedia(null)}
            className="absolute top-4 right-4 text-white hover:text-gold transition-colors z-10"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            {selectedMedia.video_url ? (
              <div className="relative w-full aspect-video">
                <iframe
                  src={getVideoEmbedUrl(selectedMedia.video_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${selectedMedia.product_category || 'Marble craftsmanship'} video by Marbrest Stone`}
                />
              </div>
            ) : (
              <img
                src={selectedMedia.image_url}
                alt={`${selectedMedia.product_category || 'Stone work'} — ${selectedMedia.stone_type || 'marble'} by Marbrest Stone`}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}

            <div className="mt-4 text-white text-center space-y-2">
              {selectedMedia.product_category && (
                <h3 className="text-2xl font-bold">{selectedMedia.product_category}</h3>
              )}
              <div className="flex items-center justify-center gap-4 text-gray-300">
                {selectedMedia.stone_type && <span className="text-lg">🪨 {selectedMedia.stone_type}</span>}
                {selectedMedia.site_location && <span className="text-lg">📍 {selectedMedia.site_location}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
