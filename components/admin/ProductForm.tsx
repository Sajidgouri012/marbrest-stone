'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Trash2 } from 'lucide-react'
import { adminApi } from '@/lib/adminApi'

interface ProductFormProps {
  product?: any
  stoneTypes: any[]
  onClose: () => void
  onSave: () => void
}

export default function ProductForm({ product, stoneTypes, onClose, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    video_url: '',
    stone_type_id: '',
    origin: '',
    features: [''],
    customizable: true,
    price_type: 'quote' as 'fixed' | 'range' | 'quote',
    base_price: '',
    min_price: '',
    max_price: '',
    price_unit: 'per sq ft',
    whatsapp_link: '',
    display_order: 0,
    visible: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        features: product.features && product.features.length > 0 ? product.features : [''],
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
        stone_type_id: formData.stone_type_id || null,
        base_price: formData.base_price ? parseFloat(formData.base_price as string) : null,
        min_price: formData.min_price ? parseFloat(formData.min_price as string) : null,
        max_price: formData.max_price ? parseFloat(formData.max_price as string) : null,
        whatsapp_link: formData.whatsapp_link || null,
      }

      if (product) {
        await adminApi('update', 'products', dataToSave, product.id)
      } else {
        await adminApi('insert', 'products', dataToSave)
      }

      onSave()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'display_order' 
          ? parseInt(value) || 0
          : name === 'base_price' || name === 'min_price' || name === 'max_price'
            ? value
            : value
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => {
      const newFeatures = [...prev.features]
      newFeatures[index] = value
      return { ...prev, features: newFeatures }
    })
  }

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-charcoal">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-charcoal">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              placeholder="e.g. Makrana White Marble"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
              placeholder="Describe the product..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Image URL *
            </label>
            <input
              type="url"
              name="image_url"
              required
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Video URL
            </label>
            <input
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              placeholder="https://example.com/video.mp4 (optional)"
            />
            <p className="text-xs text-gray-500 mt-1">Optional video to showcase the product</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Stone Type *
            </label>
            <select
              name="stone_type_id"
              required
              value={formData.stone_type_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            >
              <option value="">Select a stone type...</option>
              {stoneTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Origin *
            </label>
            <input
              type="text"
              name="origin"
              required
              value={formData.origin}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              placeholder="e.g. Makrana, Rajasthan"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Features
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                    placeholder={`Feature ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center space-x-1 text-sm text-gold hover:text-gold-light font-semibold"
              >
                <Plus size={16} />
                <span>Add Feature</span>
              </button>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-serif font-bold text-charcoal mb-4">Pricing Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Price Type *
                </label>
                <select
                  name="price_type"
                  required
                  value={formData.price_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                >
                  <option value="quote">Quote Only (Custom Made)</option>
                  <option value="range">Price Range</option>
                  <option value="fixed">Fixed Price</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.price_type === 'fixed' && 'Shows exact price with "Add to Cart" button'}
                  {formData.price_type === 'range' && 'Shows starting price with "Request Quote" button'}
                  {formData.price_type === 'quote' && 'No price shown, displays "Custom Made" badge'}
                </p>
              </div>

              {formData.price_type === 'fixed' && (
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Base Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="base_price"
                    required={formData.price_type === 'fixed'}
                    value={formData.base_price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                    placeholder="25000"
                    step="0.01"
                    min="0"
                  />
                </div>
              )}

              {formData.price_type === 'range' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Min Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="min_price"
                      required={formData.price_type === 'range'}
                      value={formData.min_price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                      placeholder="25000"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Max Price (₹)
                    </label>
                    <input
                      type="number"
                      name="max_price"
                      value={formData.max_price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                      placeholder="50000"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              )}

              {(formData.price_type === 'fixed' || formData.price_type === 'range') && (
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Price Unit
                  </label>
                  <input
                    type="text"
                    name="price_unit"
                    value={formData.price_unit}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                    placeholder="per sq ft"
                  />
                </div>
              )}

              {(formData.price_type === 'range' || formData.price_type === 'quote') && (
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    WhatsApp Link
                  </label>
                  <input
                    type="url"
                    name="whatsapp_link"
                    value={formData.whatsapp_link}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
                    placeholder="https://wa.me/919876543210?text=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional: Direct WhatsApp link for inquiries</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Display Order
            </label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              min={0}
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first on the page.</p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="customizable"
                name="customizable"
                checked={formData.customizable}
                onChange={handleChange}
                className="w-4 h-4 text-gold border-gray-300 focus:ring-gold"
              />
              <label htmlFor="customizable" className="ml-2 text-sm font-semibold text-charcoal">
                Customizable
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="visible"
                name="visible"
                checked={formData.visible}
                onChange={handleChange}
                className="w-4 h-4 text-gold border-gray-300 focus:ring-gold"
              />
              <label htmlFor="visible" className="ml-2 text-sm font-semibold text-charcoal">
                Visible on website
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gold text-charcoal font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
