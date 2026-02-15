'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { adminApi } from '@/lib/adminApi'

interface TestimonialFormProps {
  testimonial?: any
  onClose: () => void
  onSave: () => void
}

export default function TestimonialForm({ testimonial, onClose, onSave }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    client_name: '',
    client_title: '',
    company: '',
    content: '',
    rating: 5,
    project_type: 'luxury',
    display_order: 0,
    visible: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial)
    }
  }, [testimonial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (testimonial) {
        await adminApi('update', 'testimonials', formData, testimonial.id)
      } else {
        await adminApi('insert', 'testimonials', formData)
      }

      onSave()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      alert('Failed to save testimonial')
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
        : type === 'number'
        ? parseInt(value)
        : value
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
            {testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-charcoal">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Client Name *
            </label>
            <input
              type="text"
              name="client_name"
              required
              value={formData.client_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Client Title *
            </label>
            <input
              type="text"
              name="client_title"
              required
              value={formData.client_title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              placeholder="e.g., CEO, Project Manager"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Company *
            </label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Testimonial Content *
            </label>
            <textarea
              name="content"
              required
              rows={6}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
              placeholder="Share your experience working with Marbrest Stone..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Rating *
            </label>
            <select
              name="rating"
              required
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Project Type *
            </label>
            <select
              name="project_type"
              required
              value={formData.project_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="hospitality">Hospitality</option>
              <option value="luxury">Luxury</option>
            </select>
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
              {loading ? 'Saving...' : 'Save Testimonial'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
