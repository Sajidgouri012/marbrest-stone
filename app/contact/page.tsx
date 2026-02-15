'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          budget: '',
          message: '',
        })
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Let's discuss your vision and bring your dream project to life
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We welcome inquiries from around the world. Our team is ready to assist you with 
                your luxury marble and stone needs.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-full">
                    <Mail className="text-gold" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-1">Email</div>
                    <a href="mailto:info@marbreststone.com" className="text-gray-600 hover:text-gold transition-colors">
                      info@marbreststone.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-full">
                    <Phone className="text-gold" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-1">Phone</div>
                    <a href="tel:+15551234567" className="text-gray-600 hover:text-gold transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-full">
                    <MapPin className="text-gold" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-1">Location</div>
                    <p className="text-gray-600">
                      International Inquiries Welcome<br />
                      Serving clients worldwide
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-gray-50 border-l-4 border-gold">
                <h3 className="font-serif font-bold text-charcoal mb-2">Business Hours</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: By Appointment</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-charcoal mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-semibold text-charcoal mb-2">
                      Project Type *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                    >
                      <option value="">Select a type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="luxury">Luxury Development</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-semibold text-charcoal mb-2">
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                    >
                      <option value="">Select a range</option>
                      <option value="under-50k">Under $50,000</option>
                      <option value="50k-100k">$50,000 - $100,000</option>
                      <option value="100k-250k">$100,000 - $250,000</option>
                      <option value="250k-500k">$250,000 - $500,000</option>
                      <option value="over-500k">Over $500,000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-gold text-charcoal font-semibold py-4 px-8 hover:bg-gold-light transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-charcoal"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>SEND INQUIRY</span>
                      <Send size={20} />
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm">
                    Thank you for your inquiry! We'll get back to you within 24 hours.
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm">
                    There was an error sending your message. Please try again or contact us directly.
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
