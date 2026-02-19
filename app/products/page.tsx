'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Sparkles, Play, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import ProductPrice from '@/components/ProductPrice'
import QuoteRequestModal from '@/components/QuoteRequestModal'

interface StoneType {
  id: string
  name: string
  slug: string
  description: string
  display_order: number
  visible: boolean
}

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  video_url?: string
  stone_type_id: string
  stone_type?: StoneType
  origin: string
  features: string[]
  customizable: boolean
  visible: boolean
  price_type: 'fixed' | 'range' | 'quote'
  base_price?: number | null
  min_price?: number | null
  max_price?: number | null
  price_unit?: string
  whatsapp_link?: string | null
}

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stoneTypes, setStoneTypes] = useState<StoneType[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCategories, setShowCategories] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  // Fallback stone types
  const fallbackStoneTypes: StoneType[] = [
    { id: '1', name: 'White Marble', slug: 'white-marble', description: '', display_order: 1, visible: true },
    { id: '2', name: 'Colored Marble', slug: 'colored-marble', description: '', display_order: 2, visible: true },
    { id: '3', name: 'Granite', slug: 'granite', description: '', display_order: 3, visible: true },
    { id: '4', name: 'Onyx', slug: 'onyx', description: '', display_order: 4, visible: true },
    { id: '5', name: 'Custom Work', slug: 'custom', description: '', display_order: 5, visible: true },
  ]

  // Fallback products
  const fallbackProducts: Product[] = [
    {
      id: '1',
      name: 'Makrana White Marble',
      description: 'The same pristine white marble used in the Taj Mahal. Known for its exceptional purity and luminous quality.',
      image_url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2070&auto=format&fit=crop',
      stone_type_id: '1',
      origin: 'Makrana, Rajasthan',
      features: ['Taj Mahal Quality', 'Pure White', 'High Durability', 'Polished Finish'],
      customizable: true,
      visible: true,
      price_type: 'range',
      min_price: 450,
      max_price: 850,
      price_unit: 'per sq ft',
    },
    {
      id: '2',
      name: 'Italian Statuario Marble',
      description: 'Premium white marble with distinctive grey veining. Perfect for luxury countertops and feature walls.',
      image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
      stone_type_id: '1',
      origin: 'Carrara, Italy',
      features: ['Grey Veining', 'Luxury Grade', 'Versatile Use', 'Custom Sizes'],
      customizable: true,
      visible: true,
      price_type: 'fixed',
      base_price: 1200,
      price_unit: 'per sq ft',
    },
    {
      id: '3',
      name: 'Emperador Brown Marble',
      description: 'Rich brown marble with intricate white veining. Adds warmth and sophistication to any space.',
      image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
      stone_type_id: '2',
      origin: 'Spain',
      features: ['Rich Brown Tone', 'White Veining', 'Elegant Finish', 'Heat Resistant'],
      customizable: true,
      visible: true,
      price_type: 'range',
      min_price: 350,
      max_price: 650,
      price_unit: 'per sq ft',
    },
    {
      id: '4',
      name: 'Calacatta Gold Marble',
      description: 'Luxurious white marble with bold gold and grey veining. The epitome of elegance and prestige.',
      image_url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2053&auto=format&fit=crop',
      stone_type_id: '1',
      origin: 'Italy',
      features: ['Gold Veining', 'Premium Quality', 'Statement Piece', 'Bespoke Cuts'],
      customizable: true,
      visible: true,
      price_type: 'quote',
      whatsapp_link: 'https://wa.me/919876543210?text=Hi,%20I%20am%20interested%20in%20Calacatta%20Gold%20Marble',
    },
    {
      id: '5',
      name: 'Black Galaxy Granite',
      description: 'Stunning black granite with golden speckles resembling a starry night sky. Extremely durable.',
      image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
      stone_type_id: '3',
      origin: 'India',
      features: ['Golden Speckles', 'Ultra Durable', 'Low Maintenance', 'Scratch Resistant'],
      customizable: true,
      visible: true,
      price_type: 'fixed',
      base_price: 280,
      price_unit: 'per sq ft',
    },
    {
      id: '6',
      name: 'Green Onyx Slabs',
      description: 'Translucent green onyx with natural patterns. Perfect for backlit features and luxury installations.',
      image_url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop',
      stone_type_id: '4',
      origin: 'Pakistan',
      features: ['Translucent', 'Backlit Compatible', 'Unique Patterns', 'Luxury Appeal'],
      customizable: true,
      visible: true,
      price_type: 'range',
      min_price: 800,
      max_price: 1500,
      price_unit: 'per sq ft',
      whatsapp_link: 'https://wa.me/919876543210?text=Hi,%20I%20am%20interested%20in%20Green%20Onyx%20Slabs',
    },
    {
      id: '7',
      name: 'Custom Inlay Work',
      description: 'Bespoke marble inlay designs with semi-precious stones. Traditional craftsmanship meets modern design.',
      image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
      stone_type_id: '5',
      origin: 'Makrana, Rajasthan',
      features: ['Handcrafted', 'Semi-Precious Stones', 'Custom Designs', 'Heritage Technique'],
      customizable: true,
      visible: true,
      price_type: 'quote',
      whatsapp_link: 'https://wa.me/919876543210?text=Hi,%20I%20am%20interested%20in%20Custom%20Inlay%20Work',
    },
    {
      id: '8',
      name: 'Marble Flooring Tiles',
      description: 'Premium marble tiles in various sizes and finishes. Perfect for residential and commercial flooring.',
      image_url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop',
      stone_type_id: '5',
      origin: 'Multiple Origins',
      features: ['Multiple Sizes', 'Various Finishes', 'Easy Installation', 'Bulk Available'],
      customizable: true,
      visible: true,
      price_type: 'range',
      min_price: 150,
      max_price: 400,
      price_unit: 'per sq ft',
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const supabase = createClient()
      
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'show_product_categories')
        .single()
      
      if (settingsData) {
        setShowCategories(settingsData.value === 'true')
      }
      
      // Fetch stone types
      const { data: typesData, error: typesError } = await supabase
        .from('stone_types')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true })

      // Fetch products with stone type info
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          stone_type:stone_types(*)
        `)
        .eq('visible', true)

      if (typesError) throw typesError
      if (productsError) throw productsError

      // Sort products by display_order on the client side
      const sortedProducts = (productsData || []).sort((a: any, b: any) => {
        const orderA = a.display_order ?? 999
        const orderB = b.display_order ?? 999
        if (orderA !== orderB) return orderA - orderB
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      // Use database data if available, otherwise use fallback
      setStoneTypes(typesData && typesData.length > 0 ? typesData : fallbackStoneTypes)
      setProducts(sortedProducts.length > 0 ? sortedProducts : fallbackProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Use fallback data on error
      setStoneTypes(fallbackStoneTypes)
      setProducts(fallbackProducts)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...stoneTypes.map(t => t.slug)]

  const filteredProducts = products
    .filter(p => {
      // Filter by category
      if (selectedCategory !== 'all') {
        const stoneType = stoneTypes.find(t => t.id === p.stone_type_id)
        if (stoneType?.slug !== selectedCategory) return false
      }
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        return p.name.toLowerCase().includes(query) || 
               p.description.toLowerCase().includes(query)
      }
      
      return true
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
      <section className="py-20 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Our Products
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover our exquisite collection of marble, granite, and stone. Each piece can be customized 
              to your exact specifications - from dimensions to finishes.
            </p>
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gold/10 border border-gold/30 rounded-full">
              <Sparkles className="text-gold" size={20} />
              <span className="text-gold font-medium">All Products Fully Customizable</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Category Filter */}
      <section className="py-12 px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 border-2 border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none text-charcoal placeholder-gray-400"
              />
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter - conditionally shown */}
          {showCategories && (
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 font-semibold tracking-wide uppercase text-sm transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-gold text-charcoal'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                ALL
              </button>
              {stoneTypes.map((type) => (
                <button
                  key={type.slug}
                  onClick={() => setSelectedCategory(type.slug)}
                  className={`px-6 py-2 font-semibold tracking-wide uppercase text-sm transition-all duration-300 ${
                    selectedCategory === type.slug
                      ? 'bg-gold text-charcoal'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index}
                  onVideoClick={setSelectedVideo}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Customization CTA */}
      <section className="py-20 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Need Something <span className="text-gold">Unique?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Every piece can be customized to your exact requirements. Choose your dimensions, 
              finish, edge profile, and more. Our master craftsmen will bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block px-10 py-4 bg-gold text-charcoal font-semibold tracking-wide hover:bg-gold-light transition-all duration-300"
              >
                REQUEST CUSTOM QUOTE
              </a>
              <a
                href="/portfolio"
                className="inline-block px-10 py-4 border-2 border-white text-white font-semibold tracking-wide hover:bg-white hover:text-charcoal transition-all duration-300"
              >
                VIEW OUR WORK
              </a>
            </div>
          </motion.div>
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

function ProductCard({ 
  product, 
  index,
  onVideoClick
}: { 
  product: Product
  index: number
  onVideoClick: (url: string) => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [showQuoteModal, setShowQuoteModal] = useState(false)

  const handleAddToCart = () => {
    alert('Add to cart functionality coming soon!')
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-72 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent opacity-60" />
        
        {product.customizable && (
          <div className="absolute top-4 right-4 bg-gold px-3 py-1 rounded-full">
            <span className="text-charcoal text-xs font-bold">CUSTOMIZABLE</span>
          </div>
        )}

        {product.video_url && (
          <>
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center space-x-1.5 group-hover:opacity-0 transition-opacity duration-300">
              <Play size={14} className="text-white" fill="white" />
              <span className="text-white text-xs font-medium">Video</span>
            </div>
            
            <button
              onClick={() => onVideoClick(product.video_url!)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-charcoal p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <Play size={24} fill="currentColor" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-serif font-bold text-white mb-1">
            {product.name}
          </h3>
          <p className="text-gold text-sm font-medium">{product.origin}</p>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {product.description}
        </p>

        <div className="space-y-2 mb-4">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <Check className="text-gold flex-shrink-0" size={16} />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <ProductPrice
          priceType={product.price_type}
          basePrice={product.base_price}
          minPrice={product.min_price}
          maxPrice={product.max_price}
          priceUnit={product.price_unit}
          whatsappLink={product.whatsapp_link}
          productName={product.name}
          onRequestQuote={() => setShowQuoteModal(true)}
          onAddToCart={handleAddToCart}
        />
      </div>

      {showQuoteModal && (
        <QuoteRequestModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          productId={product.id}
          productName={product.name}
        />
      )}
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
