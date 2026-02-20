'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Sparkles, Play, X, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import ProductDetailModal from '@/components/ProductDetailModal'

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
  images?: string[]
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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
              Our Products & Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Premium marble, granite & stone products • Marble flooring installations • Temple & mosque artistry • 
              Carved handicrafts • Home decor • Complete contract work for residential & commercial projects
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gold/10 border border-gold/30 rounded-full">
                <Sparkles className="text-gold" size={20} />
                <span className="text-gold font-medium">Fully Customizable</span>
              </div>
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gold/10 border border-gold/30 rounded-full">
                <Check className="text-gold" size={20} />
                <span className="text-gold font-medium">Contract Work Available</span>
              </div>
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
              <p className="text-gray-600 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onProductClick={() => setSelectedProduct(product)}
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

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

function ProductCard({ 
  product, 
  index,
  onProductClick
}: { 
  product: Product
  index: number
  onProductClick: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPriceDisplay = () => {
    if (product.price_type === 'fixed' && product.base_price) {
      return formatPrice(product.base_price)
    } else if (product.price_type === 'range' && product.min_price) {
      return `From ${formatPrice(product.min_price)}`
    } else {
      return 'Request Quote'
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onProductClick}
      className="group relative bg-white border border-gray-200 hover:border-gold hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.customizable && (
            <div className="bg-gold px-2 py-0.5 rounded text-charcoal text-[10px] font-bold">
              CUSTOM
            </div>
          )}
          {product.video_url && (
            <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded flex items-center gap-1">
              <Play size={10} className="text-white" fill="white" />
              <span className="text-white text-[10px] font-medium">VIDEO</span>
            </div>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-charcoal/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <Eye size={18} />
            <span>View Details</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-semibold text-charcoal text-sm mb-1 line-clamp-2 group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{product.origin}</p>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-charcoal">
            {getPriceDisplay()}
          </span>
          {product.price_unit && product.price_type !== 'quote' && (
            <span className="text-[10px] text-gray-500">{product.price_unit}</span>
          )}
        </div>
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
