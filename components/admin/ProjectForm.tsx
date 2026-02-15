'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface ProjectFormProps {
  project?: any
  onClose: () => void
  onSave: () => void
}

export default function ProjectForm({ project, onClose, onSave }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    image_url: '',
    video_url: '',
    category: 'luxury',
    visible: true,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (project) {
      setFormData(project)
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      if (project) {
        await supabase
          .from('projects')
          .update(formData)
          .eq('id', project.id)
      } else {
        await supabase
          .from('projects')
          .insert([formData])
      }

      onSave()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
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
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-charcoal">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
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
              Video URL (Optional)
            </label>
            <input
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Category *
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="hospitality">Hospitality</option>
              <option value="luxury">Luxury</option>
            </select>
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
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
