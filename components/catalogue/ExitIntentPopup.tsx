'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    /* Only on desktop, only once per session */
    if (window.innerWidth < 1024) return
    if (sessionStorage.getItem('marbrest_exit_shown')) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        sessionStorage.setItem('marbrest_exit_shown', '1')
        setShow(true)
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 5000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    const subject = encodeURIComponent('Free Catalogue Request')
    const body = encodeURIComponent(`Please send me the free Marbrest Stone catalogue.\n\nEmail: ${email}`)
    window.open(`mailto:info@marbreststone.com?subject=${subject}&body=${body}`)
    sessionStorage.setItem('marbrest_exit_shown', '1')
    setSubmitted(true)
  }

  const handleClose = () => {
    setShow(false)
    sessionStorage.setItem('marbrest_exit_shown', '1')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="exit-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            key="exit-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white w-full max-w-[480px] rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold bar */}
            <div className="h-1.5 bg-[#B8962E]" />

            <div className="p-8">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-charcoal transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {submitted ? (
                <div className="text-center">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-serif font-bold text-charcoal mb-2">On its way!</h3>
                  <p className="text-gray-600 text-sm">Your catalogue request has been sent. We&apos;ll email it to you shortly.</p>
                  <button onClick={handleClose} className="mt-6 text-sm text-gray-500 hover:text-charcoal underline transition-colors">
                    Continue browsing
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-serif font-bold text-charcoal mb-2">Before you go...</h3>
                  <p className="text-gray-600 mb-6">
                    Get our <span className="font-semibold text-[#B8962E]">FREE Marble Catalogue</span> sent directly to your inbox.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#B8962E] focus:ring-2 focus:ring-[#B8962E]/20 outline-none transition-all rounded-sm"
                      placeholder="your@email.com"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#B8962E] text-white font-semibold hover:bg-[#9A7D25] transition-colors rounded-sm"
                    >
                      Send My Free Catalogue
                    </button>
                  </form>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>✓ Includes product specs</span>
                    <span>✓ Pricing guidance</span>
                    <span>✓ No spam ever</span>
                  </div>

                  <button
                    onClick={handleClose}
                    className="mt-5 text-sm text-gray-400 hover:text-charcoal transition-colors"
                  >
                    No thanks, I&apos;ll browse →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
