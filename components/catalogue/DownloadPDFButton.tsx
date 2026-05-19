'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Download, CheckCircle, AlertCircle, FileText, X } from 'lucide-react'
import { generateCataloguePDF, PDFType, PDFProduct } from '@/lib/generateCataloguePDF'

interface DownloadPDFButtonProps {
  type: PDFType
  products: PDFProduct[]
  categoryName?: string
  variant?: 'primary' | 'outline' | 'sidebar'
  className?: string
}

export default function DownloadPDFButton({
  type,
  products,
  categoryName,
  variant = 'primary',
  className = '',
}: DownloadPDFButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [progress, setProgress] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [fileName, setFileName] = useState('')

  async function handleDownload() {
    if (status === 'loading' || products.length === 0) return
    setStatus('loading')
    setProgress('Preparing catalogue...')

    const today = new Date().toISOString().split('T')[0]
    const label = (categoryName || 'Complete_Catalogue').replace(/\s+/g, '_')
    const generatedFileName = `MarbrestStone_${label}_${today}.pdf`

    try {
      await generateCataloguePDF(type, products, categoryName, setProgress)
      setStatus('done')
      setProgress('')
      setFileName(generatedFileName)
      setToastVisible(true)
      sessionStorage.setItem('marbrest_exit_shown', '1')
      setTimeout(() => { setStatus('idle') }, 3000)
      setTimeout(() => setToastVisible(false), 6000)
    } catch (err) {
      console.error('PDF generation failed:', err)
      setStatus('error')
      setProgress('Failed — please try again')
      setTimeout(() => { setStatus('idle'); setProgress('') }, 3000)
    }
  }

  const baseClasses = 'inline-flex items-center gap-2 font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60'

  const variantClasses = {
    primary: 'px-6 py-3 bg-[#B8962E] text-white hover:bg-[#9A7D25]',
    outline: 'px-6 py-3 border-2 border-[#B8962E] text-[#B8962E] hover:bg-[#B8962E] hover:text-white',
    sidebar: 'w-full px-4 py-2.5 bg-[#1A1A1A] text-white hover:bg-[#2d2d2d] text-sm justify-center',
  }

  return (
    <>
      <div className={`flex flex-col items-center gap-1.5 ${className}`}>
        <button
          onClick={handleDownload}
          disabled={status === 'loading' || products.length === 0}
          aria-label={`Download ${categoryName || 'full'} catalogue as PDF`}
          className={`${baseClasses} ${variantClasses[variant]}`}
        >
          {status === 'idle' && (
            <><Download size={16} /> Download PDF Catalogue</>
          )}
          {status === 'loading' && (
            <><Loader2 size={16} className="animate-spin" /> Generating...</>
          )}
          {status === 'done' && (
            <><CheckCircle size={16} /> Download Complete!</>
          )}
          {status === 'error' && (
            <><AlertCircle size={16} /> Try Again</>
          )}
        </button>

        {progress && status === 'loading' && (
          <p className="text-[11px] text-gray-500">{progress}</p>
        )}

        {products.length === 0 && (
          <p className="text-[11px] text-gray-400">No products to download</p>
        )}
      </div>

      {/* Download toast — fixed to bottom of screen, visible on all devices */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-32px)] max-w-sm"
          >
            <div className="flex items-center gap-3 bg-[#1A1A1A] text-white rounded-xl px-4 py-3 shadow-2xl border border-[#B8962E]/30">
              {/* File icon */}
              <div className="w-10 h-10 bg-[#B8962E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-[#B8962E]" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">Download complete</p>
                <p className="text-[11px] text-gray-400 truncate mt-0.5">{fileName}</p>
                <p className="text-[10px] text-[#B8962E] mt-0.5">Saved to your Downloads folder</p>
              </div>

              {/* Dismiss */}
              <button
                onClick={() => setToastVisible(false)}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>

            {/* Progress bar that shrinks over 6s */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 6, ease: 'linear' }}
              style={{ originX: 0 }}
              className="h-0.5 bg-[#B8962E] rounded-full mt-1 mx-1"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
