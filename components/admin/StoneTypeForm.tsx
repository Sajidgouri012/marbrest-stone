'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { adminApi } from '@/lib/adminApi'

interface StoneTypeFormProps {
  stoneType?: any
  onClose: () => void
  onSave: () => void
}

export default function StoneTypeForm({ stoneType, onClose, onSave }: StoneTypeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
    visible: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (stoneType) {
      setFormData(stoneType)
    }
  }, [stoneType])

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSave = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
      }

      if (stoneType) {
        await adminApi('update', 'stone_types', dataToSave, stoneType.id)
      } else {
        await adminApi('insert', 'stone_types', dataToSave)
      }

      onSave()
    } catch (error) {
      console.error('Error saving stone type:', error)
      alert('Failed to save stone type')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                     name === 'display_order' ? parseInt(value) || 0 : value

    setFormData(prev => {
      const updated = { ...prev, [name]: newValue }
      if (name === 'name' && !stoneType) {
        updated.slug = generateSlug(value)
      }
      return updated
    })
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
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-charcoal">
            {stoneType ? 'Edit Stone Type' : 'Add New Stone Type'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-charcoal">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              placeholder="e.g. White Marble"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-gray-50"
              placeholder="Auto-generated from name"
            />
            <p className="text-xs text-gray-500 mt-1">Used in URLs and filtering. Auto-generated if left empty.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none"
              placeholder="Brief description of this stone type"
            />
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
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the filter bar.</p>
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
              {loading ? 'Saving...' : 'Save Stone Type'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
