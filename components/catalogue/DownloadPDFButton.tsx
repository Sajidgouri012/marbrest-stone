'use client'

import { useState } from 'react'
import { Loader2, Download, CheckCircle, AlertCircle } from 'lucide-react'
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

  async function handleDownload() {
    if (status === 'loading' || products.length === 0) return
    setStatus('loading')
    setProgress('Preparing catalogue...')

    try {
      await generateCataloguePDF(type, products, categoryName, setProgress)
      setStatus('done')
      setProgress('Downloaded!')
      sessionStorage.setItem('marbrest_exit_shown', '1')
      setTimeout(() => { setStatus('idle'); setProgress('') }, 3000)
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
  )
}
