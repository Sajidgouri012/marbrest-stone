'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  prefilledProduct?: string
  prefilledProjectType?: string
}

const PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Hotel/Hospitality',
  'Temple/Mosque',
  'Export/Wholesale',
  'Sample Request',
  'Other',
]

const TIMELINES = [
  'Immediate',
  '1–3 Months',
  '3–6 Months',
  '6–12 Months',
  'Just Exploring',
]

export default function QuoteModal({
  isOpen,
  onClose,
  prefilledProduct = '',
  prefilledProjectType = '',
}: QuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    products: prefilledProduct,
    projectType: prefilledProjectType || '',
    quantity: '',
    country: '',
    timeline: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  /* Sync pre-fill when props change */
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        products: prefilledProduct || prev.products,
        projectType: prefilledProjectType || prev.projectType,
      }))
    }
  }, [isOpen, prefilledProduct, prefilledProjectType])

  /* Focus first input on open */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100)
    }
  }, [isOpen])

  /* Close on Escape */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = 'Full name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Please enter a valid email address'
    if (!formData.phone.trim()) errs.phone = 'Phone number is required'
    if (!formData.projectType) errs.projectType = 'Please select a project type'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const requirements = [
        formData.products && `Products: ${formData.products}`,
        formData.projectType && `Project Type: ${formData.projectType}`,
        formData.quantity && `Quantity/Area: ${formData.quantity}`,
        formData.country && `Delivery Country: ${formData.country}`,
        formData.timeline && `Timeline: ${formData.timeline}`,
        formData.company && `Company: ${formData.company}`,
        formData.notes && `Notes: ${formData.notes}`,
      ]
        .filter(Boolean)
        .join('\n')

      const { error } = await supabase.from('quote_requests').insert([
        {
          product_name: formData.products || 'General Catalogue Enquiry',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          requirements,
          status: 'pending',
        },
      ])

      if (error) throw error
      setSuccess(true)
    } catch {
      /* Fallback to mailto if Supabase fails */
      const subject = encodeURIComponent(`Quote Request — ${formData.projectType || 'General'}`)
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nCompany: ${formData.company}\nProducts: ${formData.products}\nProject Type: ${formData.projectType}\nQuantity: ${formData.quantity}\nCountry: ${formData.country}\nTimeline: ${formData.timeline}\nNotes: ${formData.notes}`
      )
      window.open(`mailto:info@marbreststone.com?subject=${subject}&body=${body}`)
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '', email: '', phone: '', company: '',
      products: '', projectType: '', quantity: '',
      country: '', timeline: '', notes: '',
    })
    setErrors({})
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex justify-between items-start z-10">
            <div>
              <h2 id="quote-modal-title" className="text-2xl font-serif font-bold text-charcoal mb-1">
                Request a Quote
              </h2>
              {formData.products && (
                <p className="text-sm text-gray-600">
                  For: <span className="font-semibold text-charcoal">{formData.products}</span>
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-charcoal transition-colors p-1"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Success State */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="text-green-600" size={48} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-charcoal mb-3">Quote Request Sent!</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                Thank you, <strong>{formData.name}</strong>. We&apos;ve received your enquiry and will send your personalised quote to <strong>{formData.email}</strong> within 4 hours.
              </p>
              <a
                href={`https://wa.me/918000485312?text=${encodeURIComponent("Hi! I just submitted a quote request on marbreststone.com and would like to discuss further.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-md hover:bg-[#1daa54] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us for Faster Response
              </a>
              <div className="mt-6">
                <button onClick={handleClose} className="text-gray-500 hover:text-charcoal transition-colors underline text-sm">
                  Close
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Full Name *</label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Company / Project Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Products Interested In</label>
                <input
                  type="text"
                  name="products"
                  value={formData.products}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all"
                  placeholder="e.g. Marble Flooring, Home Temple, Fountain..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Project Type */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Project Type *</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.projectType ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all bg-white`}
                  >
                    <option value="">Select project type...</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.projectType && <p className="text-red-600 text-xs mt-1">{errors.projectType}</p>}
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all bg-white"
                  >
                    <option value="">Select timeline...</option>
                    {TIMELINES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Quantity / Area Required</label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all"
                    placeholder="e.g. 500 sq ft or 20 pieces"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Delivery Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    autoComplete="country"
                    className="w-full px-4 py-3 border border-gray-300 focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all"
                    placeholder="e.g. United States"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">Additional Notes</label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none resize-none transition-all"
                  placeholder="Any special requirements, finish preferences, installation notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#B8962E] text-white font-semibold hover:bg-[#9A7D25] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" size={18} /><span>Submitting...</span></>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center">
                ✓ Free Consultation &nbsp;✓ Response within 4 hours &nbsp;✓ No commitment
              </p>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
