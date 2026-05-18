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
    const cleaned = phone.replace(/[\s\-\+]/g, '')
    if (cleaned.length < 7 || cleaned.length > 15) return 'Phone number must be between 7–15 digits'
    if (!/^\d+$/.test(cleaned)) return 'Phone number must contain only digits'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const phoneValidation = validatePhone(formData.phone)
    if (phoneValidation) { setPhoneError(phoneValidation); return }
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
        setFormData({ name: '', email: '', phone: '', company: '', projectType: '', projectCountry: '', projectTimeline: '', howHeard: '', message: '' })
        setPhoneError('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'phone' && phoneError) setPhoneError('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /* Shared input class — 16px font size is CRITICAL to prevent iOS zoom */
  const inputClass = `w-full px-4 border border-[#E0D8CF] rounded-lg outline-none transition-all duration-200 text-charcoal placeholder-gray-400 focus:border-[#B8962E] focus:shadow-[0_0_0_3px_rgba(184,150,46,0.15)]`
  const inputStyle = { minHeight: '52px', fontSize: '16px', paddingTop: '14px', paddingBottom: '14px' }

  if (status === 'success') {
    return (
      <div className="min-h-screen pt-20 pb-24 md:pb-0 flex items-center justify-center bg-white px-5">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-charcoal mb-4">Message Received!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            ✓ We'll be in touch within 24 hours. For faster response, WhatsApp us directly:
          </p>
          <a
            href="https://wa.me/918000485312?text=Hi%2C%20I%27ve%20just%20submitted%20a%20project%20inquiry%20on%20your%20website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-md hover:bg-[#1daa54] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp: +91 80004 85312
          </a>
          <div className="mt-6">
            <button
              onClick={() => setStatus('idle')}
              className="text-gray-500 hover:text-charcoal text-sm underline transition-colors"
            >
              Submit another inquiry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-24 md:pb-0">
      {/* Hero */}
      <section className="py-16 px-5 bg-charcoal text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-serif font-bold mb-5">
              Request Your Free Project Consultation
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Tell us about your marble or stone project. We work with architects, developers,
              and international buyers. Response within 24 hours guaranteed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick-contact strip — mobile first, visible on all sizes */}
      <section className="bg-[#F8F5F0] border-b border-[#E8E0D5]">
        <div className="container">
          <div className="grid grid-cols-3 divide-x divide-[#E8E0D5]">
            <a
              href="tel:+918000485312"
              className="flex flex-col items-center justify-center gap-1.5 py-5 text-center hover:bg-[#E8E0D5] transition-colors"
            >
              <Phone size={22} className="text-[#B8962E]" />
              <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">Call Us</span>
              <span className="text-xs text-gray-500 hidden sm:block">+91 80004 85312</span>
            </a>
            <a
              href="https://wa.me/918000485312?text=Hi%2C%20I%27m%20interested%20in%20a%20marble%20project"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 py-5 text-center hover:bg-[#E8E0D5] transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">WhatsApp</span>
              <span className="text-xs text-gray-500 hidden sm:block">Chat Now</span>
            </a>
            <a
              href="mailto:info@marbreststone.com"
              className="flex flex-col items-center justify-center gap-1.5 py-5 text-center hover:bg-[#E8E0D5] transition-colors"
            >
              <Mail size={22} className="text-[#B8962E]" />
              <span className="text-xs font-semibold text-charcoal uppercase tracking-wide">Email Us</span>
              <span className="text-xs text-gray-500 hidden sm:block">info@marbreststone.com</span>
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif font-bold text-charcoal mb-5">Contact Information</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We welcome inquiries from around the world. Our team is ready to assist you with
                your luxury marble and stone needs.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#B8962E]/10 p-3 rounded-full flex-shrink-0">
                    <Mail className="text-[#B8962E]" size={22} />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-1">Email</div>
                    <a href="mailto:info@marbreststone.com" className="text-gray-600 hover:text-[#B8962E] transition-colors text-sm">
                      info@marbreststone.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#B8962E]/10 p-3 rounded-full flex-shrink-0">
                    <Phone className="text-[#B8962E]" size={22} />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-1">Phone / WhatsApp</div>
                    <div className="space-y-1 text-sm">
                      <a href="tel:+918000485312" className="block text-gray-600 hover:text-[#B8962E] transition-colors">+91 80004 85312</a>
                      <a href="tel:+918852821094" className="block text-gray-600 hover:text-[#B8962E] transition-colors">+91 88528 21094</a>
                      <a href="tel:+919952589286" className="block text-gray-600 hover:text-[#B8962E] transition-colors">+91 99525 89286</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#B8962E]/10 p-3 rounded-full flex-shrink-0">
                    <MapPin className="text-[#B8962E]" size={22} />
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-1">Address</div>
                    <address className="not-italic text-gray-600 leading-relaxed text-sm">
                      Marbrest Stone<br />
                      Makrana, Rajasthan — 341505, India<br />
                      <span className="text-[#B8962E] font-medium">Export Inquiries Welcome Worldwide</span>
                    </address>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-5 bg-[#F8F5F0] border-l-4 border-[#B8962E]">
                <h3 className="font-serif font-bold text-charcoal mb-2 text-base">Business Hours</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
                  <p>Saturday: 10:00 AM – 4:00 PM</p>
                  <p>Sunday: By Appointment</p>
                </div>
              </div>

              {/* Google Maps */}
              <div className="mt-8">
                <h3 className="font-serif font-bold text-charcoal mb-4 text-base">Find Us</h3>
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

            {/* Contact Form column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Phone + Company */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-1.5">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Include country code"
                      className={`${inputClass} ${phoneError ? 'border-red-500' : ''}`}
                      style={inputStyle}
                    />
                    {phoneError && <p className="text-red-500 mt-1" style={{ fontSize: '0.85rem' }}>{phoneError}</p>}
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-charcoal mb-1.5">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={handleChange}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label htmlFor="projectType" className="block text-sm font-semibold text-charcoal mb-1.5">Project Type *</label>
                  <select
                    id="projectType"
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
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
                    <label htmlFor="projectCountry" className="block text-sm font-semibold text-charcoal mb-1.5">Country of Project</label>
                    <input
                      type="text"
                      id="projectCountry"
                      name="projectCountry"
                      autoComplete="country-name"
                      value={formData.projectCountry}
                      onChange={handleChange}
                      placeholder="e.g. UAE, UK, USA"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="projectTimeline" className="block text-sm font-semibold text-charcoal mb-1.5">Approximate Timeline</label>
                    <select
                      id="projectTimeline"
                      name="projectTimeline"
                      value={formData.projectTimeline}
                      onChange={handleChange}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="">Select timeline</option>
                      <option value="immediate">Immediate (within 1 month)</option>
                      <option value="1-3-months">1–3 months</option>
                      <option value="3-6-months">3–6 months</option>
                      <option value="planning">Planning stage</option>
                    </select>
                  </div>
                </div>

                {/* How heard */}
                <div>
                  <label htmlFor="howHeard" className="block text-sm font-semibold text-charcoal mb-1.5">How did you hear about us?</label>
                  <select
                    id="howHeard"
                    name="howHeard"
                    value={formData.howHeard}
                    onChange={handleChange}
                    className={inputClass}
                    style={inputStyle}
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
                  <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-1.5">Project Details *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    className={inputClass}
                    style={{ fontSize: '16px', resize: 'vertical', paddingTop: '14px', paddingBottom: '14px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-[#B8962E] text-white font-semibold hover:bg-[#9A7D25] transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                  style={{ height: '56px', fontSize: '1rem' }}
                >
                  {status === 'sending' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send My Project Details — We&apos;ll Respond in 24 Hours</span>
                      <Send size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  🔒 Your information is private. No spam, ever. We typically respond within 4 business hours.
                </p>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg">
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
