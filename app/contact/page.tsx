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
    projectCountry: '',
    projectTimeline: '',
    howHeard: '',
    message: '',
  })
  const [phoneError, setPhoneError] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[\s-]/g, '')
    if (cleaned.length < 10 || cleaned.length > 15) {
      return 'Phone number must be between 10-15 digits'
    }
    if (!/^\d+$/.test(cleaned)) {
      return 'Phone number must contain only digits'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const phoneValidation = validatePhone(formData.phone)
    if (phoneValidation) {
      setPhoneError(phoneValidation)
      return
    }

    setPhoneError('')
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
          projectCountry: '',
          projectTimeline: '',
          howHeard: '',
          message: '',
        })
        setPhoneError('')
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'phone' && phoneError) setPhoneError('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen pt-20 pb-20 md:pb-0">
      <section className="py-20 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
              Request Your Free Project Consultation
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Tell us about your marble or stone project. We work with architects, developers, and international buyers. Response within 24 hours guaranteed.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
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
                    <a
                      href="mailto:info@marbreststone.com"
                      className="text-gray-600 hover:text-gold transition-colors"
                      rel="noopener noreferrer"
                    >
                      info@marbreststone.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-full">
                    <Phone className="text-gold" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-1">Phone / WhatsApp</div>
                    <div className="space-y-1">
                      <a href="tel:+918000485312" className="block text-gray-600 hover:text-gold transition-colors">
                        +91 80004 85312
                      </a>
                      <a href="tel:+918852821094" className="block text-gray-600 hover:text-gold transition-colors">
                        +91 88528 21094
                      </a>
                      <a href="tel:+919952589286" className="block text-gray-600 hover:text-gold transition-colors">
                        +91 99525 89286
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gold/10 p-3 rounded-full">
                    <MapPin className="text-gold" size={24} />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-1">Address</div>
                    <address className="not-italic text-gray-600 leading-relaxed">
                      Marbrest Stone<br />
                      Makrana, Rajasthan — 341505, India<br />
                      <span className="text-gold font-medium">Export Inquiries Welcome Worldwide</span>
                    </address>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-gray-50 border-l-4 border-gold">
                <h3 className="font-serif font-bold text-charcoal mb-2">Business Hours</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                  <p>Saturday: 10:00 AM – 4:00 PM</p>
                  <p>Sunday: By Appointment</p>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="mt-10">
                <h3 className="font-serif font-bold text-charcoal mb-4">Find Us</h3>
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <iframe
                    title="Marbrest Stone location — Makrana, Rajasthan, India"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3553.564450562705!2d74.73514687519565!3d27.04392565443991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396b9df38ff2eedb%3A0x655a4db926065c2f!2sMarbrest%20Stone!5e0!3m2!1sen!2sin!4v1779088318229!5m2!1sen!2sin"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                {/* Phone + Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-2">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Include country code"
                      className={`w-full px-4 py-3 border ${phoneError ? 'border-red-500' : 'border-gray-300'} focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors`}
                    />
                    {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
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

                {/* Project Type */}
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
                    <option value="marble-flooring">Marble Flooring</option>
                    <option value="carvings-handicrafts">Custom Carvings / Handicrafts</option>
                    <option value="temple-mosque">Temple / Mosque Construction</option>
                    <option value="hotel-hospitality">Hotel / Hospitality Project</option>
                    <option value="export-wholesale">Export / Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Country + Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="projectCountry" className="block text-sm font-semibold text-charcoal mb-2">
                      Country of Project
                    </label>
                    <input
                      type="text"
                      id="projectCountry"
                      name="projectCountry"
                      value={formData.projectCountry}
                      onChange={handleChange}
                      placeholder="e.g. UAE, UK, USA"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectTimeline" className="block text-sm font-semibold text-charcoal mb-2">
                      Approximate Project Timeline
                    </label>
                    <select
                      id="projectTimeline"
                      name="projectTimeline"
                      value={formData.projectTimeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (within 1 month)</option>
                      <option value="1-3-months">1–3 months</option>
                      <option value="3-6-months">3–6 months</option>
                      <option value="planning">Planning stage</option>
                    </select>
                  </div>
                </div>

                {/* How did you hear about us */}
                <div>
                  <label htmlFor="howHeard" className="block text-sm font-semibold text-charcoal mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    id="howHeard"
                    name="howHeard"
                    value={formData.howHeard}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                  >
                    <option value="">Select an option</option>
                    <option value="google">Google Search</option>
                    <option value="referral">Referral</option>
                    <option value="social-media">Social Media</option>
                    <option value="trade-directory">Trade Directory</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
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
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-charcoal" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send My Project Details — We&apos;ll Respond Within 24 Hours</span>
                      <Send size={20} />
                    </>
                  )}
                </button>

                {/* Trust line */}
                <p className="text-center text-sm text-gray-500 mt-2">
                  🔒 Your information is private. No spam, ever. We typically respond within 4 business hours.
                </p>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm">
                    Thank you for your inquiry! We&apos;ll get back to you within 24 hours.
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
