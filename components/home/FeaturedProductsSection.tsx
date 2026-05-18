'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Product {
  id: string
  name: string
  description: string
  image_url: string
  product_category?: {
    name: string
  }
  price_type: 'fixed' | 'range' | 'quote'
  base_price?: number
  min_price?: number
  max_price?: number
  price_unit?: string
}

export default function FeaturedProductsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_category:products_categories(name)
          `)
          .eq('visible', true)
          .order('display_order', { ascending: true })
          .limit(4)

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const formatPrice = (product: Product) => {
    if (product.price_type === 'quote') {
      return 'Request Quote'
    } else if (product.price_type === 'range' && product.min_price && product.max_price) {
      return `$${product.min_price} - $${product.max_price}`
    } else if (product.price_type === 'fixed' && product.base_price) {
      return `$${product.base_price}`
    }
    return 'Request Quote'
  }

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container text-center">
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-gray-400">Loading products...</div>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section ref={ref} id="products" className="py-12 md:py-16 bg-white">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 fade-up"
        >
          <span className="text-[#B8962E] text-sm font-semibold tracking-wider sm:tracking-widest uppercase">Products &amp; Services</span>
          <div className="h-px w-16 bg-[#B8962E] mx-auto mt-2 mb-6" />
          <h2 className="font-serif font-bold text-charcoal mb-4">
            Premium Stones &amp; Craftsmanship
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Natural stones, marble flooring, Mosque &amp; temple artistry, carved handicrafts, home decor, and complete contract work
          </p>
        </motion.div>

        {/* 1 col → 2 col @640px → 3 col @1024px → 4 col @1280px */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <motion.a
              key={product.id}
              href="/products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image_url}
                  alt={`${product.name} — premium marble product by Marbrest Stone`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                {product.product_category && (
                  <span className="text-xs text-gold font-semibold tracking-wider uppercase">
                    {product.product_category.name}
                  </span>
                )}
                <h3 className="text-lg sm:text-xl font-serif font-bold text-charcoal mt-2 mb-2 group-hover:text-gold transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-charcoal">
                    {formatPrice(product)}
                    {product.price_unit && product.price_type !== 'quote' && (
                      <span className="text-xs text-gray-500 ml-1">/{product.price_unit}</span>
                    )}
                  </span>
                  <ArrowRight className="text-gold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={18} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <a
            href="/products"
            className="inline-flex items-center px-8 py-3 border-2 border-charcoal text-charcoal font-semibold tracking-wide hover:bg-charcoal hover:text-white transition-all duration-300 shadow-sm group rounded-md"
          >
            VIEW ALL PRODUCTS
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
