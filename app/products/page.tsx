'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Check, Sparkles, Play, X, Eye, Filter, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import ProductDetailModal from '@/components/ProductDetailModal'

interface ProductCategory {
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
  product_category_id: string
  product_category?: ProductCategory
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
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCategories, setShowCategories] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Fallback product categories
  const fallbackProductCategories: ProductCategory[] = [
    { id: '1', name: 'Fountains', slug: 'fountains', description: '', display_order: 1, visible: true },
    { id: '2', name: 'Home Temples', slug: 'home-temples', description: '', display_order: 2, visible: true },
    { id: '3', name: 'Flooring', slug: 'flooring', description: '', display_order: 3, visible: true },
    { id: '4', name: 'Mosque Work', slug: 'mosque-work', description: '', display_order: 4, visible: true },
    { id: '5', name: 'Coffee Tables', slug: 'coffee-tables', description: '', display_order: 5, visible: true },
    { id: '6', name: 'Dining Tables', slug: 'dining-tables', description: '', display_order: 6, visible: true },
    { id: '7', name: 'Wash Basin', slug: 'wash-basin', description: '', display_order: 7, visible: true },
    { id: '8', name: 'Bottle Stands', slug: 'bottle-stands', description: '', display_order: 8, visible: true },
    { id: '9', name: 'Home Decor', slug: 'home-decor', description: '', display_order: 9, visible: true },
    { id: '10', name: 'Other', slug: 'other', description: '', display_order: 10, visible: true },
  ]

  // Fallback products
  const fallbackProducts: Product[] = [
    {
      id: '1',
      name: 'Marble Garden Fountain',
      description: 'Elegant hand-carved marble fountain perfect for gardens and courtyards.',
      image_url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=2070&auto=format&fit=crop',
      product_category_id: '1',
      origin: 'Makrana, Rajasthan',
      features: ['Hand Carved', 'Weather Resistant', 'Custom Sizes', 'Traditional Design'],
      customizable: true,
      visible: true,
      price_type: 'quote',
    },
    {
      id: '2',
      name: 'Traditional Home Temple',
      description: 'Sacred marble temple for home worship with intricate carvings.',
      image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop',
      product_category_id: '2',
      origin: 'India',
      features: ['Handcrafted', 'Sacred Design', 'Multiple Sizes', 'Custom Engravings'],
      customizable: true,
      visible: true,
      price_type: 'quote',
    },
    {
      id: '3',
      name: 'Premium Marble Flooring',
      description: 'Luxurious marble flooring tiles in various sizes and finishes.',
      image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
      product_category_id: '3',
      origin: 'Multiple Origins',
      features: ['Multiple Sizes', 'Various Finishes', 'Easy Installation', 'Bulk Available'],
      customizable: true,
      visible: true,
      price_type: 'range',
      min_price: 150,
      max_price: 400,
      price_unit: 'per sq ft',
    },
    {
      id: '4',
      name: 'Luxury Marble Coffee Table',
      description: 'Stunning marble coffee table with elegant design.',
      image_url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2053&auto=format&fit=crop',
      product_category_id: '5',
      origin: 'Italy',
      features: ['Modern Design', 'Durable', 'Custom Sizes', 'Premium Finish'],
      customizable: true,
      visible: true,
      price_type: 'quote',
    },
    {
      id: '5',
      name: 'Marble Dining Table',
      description: 'Elegant marble dining table with custom base options.',
      image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
      product_category_id: '6',
      origin: 'India',
      features: ['Custom Sizes', 'Multiple Marble Options', 'Luxury Finish', 'Durable'],
      customizable: true,
      visible: true,
      price_type: 'quote',
    },
    {
      id: '6',
      name: 'Designer Marble Wash Basin',
      description: 'Handcrafted marble wash basin with modern design.',
      image_url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop',
      product_category_id: '7',
      origin: 'Makrana, Rajasthan',
      features: ['Handcrafted', 'Water Resistant', 'Custom Design', 'Premium Quality'],
      customizable: true,
      visible: true,
      price_type: 'quote',
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
      
      // Fetch product categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('products_categories')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true })

      // Fetch products with category info
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_category:products_categories(*)
        `)
        .eq('visible', true)

      if (categoriesError) throw categoriesError
      if (productsError) throw productsError

      // Sort products by display_order on the client side
      const sortedProducts = (productsData || []).sort((a: any, b: any) => {
        const orderA = a.display_order ?? 999
        const orderB = b.display_order ?? 999
        if (orderA !== orderB) return orderA - orderB
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      // Use database data if available, otherwise use fallback
      setProductCategories(categoriesData && categoriesData.length > 0 ? categoriesData : fallbackProductCategories)
      setProducts(sortedProducts.length > 0 ? sortedProducts : fallbackProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Use fallback data on error
      setProductCategories(fallbackProductCategories)
      setProducts(fallbackProducts)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...productCategories.map(t => t.slug)]

  const filteredProducts = products
    .filter(p => {
      // Filter by category
      if (selectedCategory !== 'all') {
        const category = productCategories.find(t => t.id === p.product_category_id)
        if (category?.slug !== selectedCategory) return false
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
              Premium marble, granite & stone products • Marble flooring installations • Mosque & temple artistry • 
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

      {/* Custom Design Message */}
      <section className="py-8 px-6 lg:px-8 bg-gradient-to-r from-gold/5 to-gold/10 border-y border-gold/20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-lg md:text-xl text-charcoal leading-relaxed">
              <span className="font-semibold text-gold">Note:</span> All these products are available, but we also create{' '}
              <span className="font-semibold text-charcoal">custom designs</span> based on your choice of{' '}
              <span className="font-semibold text-charcoal">pattern, design, and stone type</span>.{' '}
              Whether you need a unique piece or modifications to existing designs, our master craftsmen can bring your vision to life.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2 bg-gold text-charcoal font-semibold hover:bg-gold-light transition-all duration-300 text-sm"
              >
                <Sparkles size={16} />
                Request Custom Design
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Bar and Filter Button */}
      <section className="py-8 px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 items-center">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-4 bg-gold text-charcoal font-semibold hover:bg-gold-light transition-all duration-300 whitespace-nowrap"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={selectedCategory === 'all' ? "Search all products..." : `Search in ${productCategories.find(t => t.slug === selectedCategory)?.name || 'category'}...`}
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
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-8 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Sidebar - Desktop: always visible, Mobile: toggle */}
            <aside className={`${
              isSidebarOpen ? 'fixed inset-0 z-50 bg-black/50' : 'hidden'
            } lg:relative lg:block lg:w-64 lg:flex-shrink-0 lg:bg-transparent`}>
              <div className={`${
                isSidebarOpen ? 'absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto' : ''
              } lg:sticky lg:top-24 lg:bg-gray-50 lg:p-6 lg:rounded-lg lg:shadow-sm`}>
                {/* Mobile Close Button */}
                {isSidebarOpen && (
                  <div className="lg:hidden flex items-center justify-between p-6 border-b border-gray-200 bg-charcoal text-white">
                    <h3 className="text-lg font-semibold">Filter Products</h3>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                )}

                <div className="p-6 lg:p-0">
                  <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4 hidden lg:block">Categories</h3>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory('all')
                        setIsSidebarOpen(false)
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-between group ${
                        selectedCategory === 'all'
                          ? 'bg-gold text-charcoal shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>All Products</span>
                      {selectedCategory === 'all' && <ChevronRight size={18} className="text-charcoal" />}
                    </button>
                    
                    {productCategories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => {
                          setSelectedCategory(category.slug)
                          setIsSidebarOpen(false)
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-between group ${
                          selectedCategory === category.slug
                            ? 'bg-gold text-charcoal shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{category.name}</span>
                        {selectedCategory === category.slug && <ChevronRight size={18} className="text-charcoal" />}
                      </button>
                    ))}
                  </div>

                  {/* Active Filter Display */}
                  {selectedCategory !== 'all' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Active Filter</p>
                      <div className="flex items-center justify-between bg-gold/10 border border-gold/30 rounded-lg px-3 py-2">
                        <span className="text-sm font-medium text-charcoal">
                          {productCategories.find(t => t.slug === selectedCategory)?.name}
                        </span>
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="text-charcoal hover:text-gold transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {loading ? 'Loading...' : (
                    <>
                      <span className="font-semibold text-charcoal">{filteredProducts.length}</span>
                      {' '}{filteredProducts.length === 1 ? 'product' : 'products'}
                      {selectedCategory !== 'all' && (
                        <span> in <span className="font-semibold text-gold">{productCategories.find(t => t.slug === selectedCategory)?.name}</span></span>
                      )}
                      {searchQuery && (
                        <span> matching "<span className="font-semibold text-charcoal">{searchQuery}</span>"</span>
                      )}
                    </>
                  )}
                </p>
              </div>

              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg mb-2">No products found.</p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('all')
                      }}
                      className="text-gold hover:text-gold-light font-medium underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
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
          </div>
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
