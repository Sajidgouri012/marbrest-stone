'use client'

interface SampleBannerProps {
  categoryName?: string
  onRequest: () => void
}

export default function SampleBanner({ categoryName, onRequest }: SampleBannerProps) {
  return (
    <div
      className="col-span-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg px-6 py-5"
      style={{
        background: '#F8F5F0',
        borderLeft: '4px solid #B8962E',
      }}
    >
      <div>
        <p className="font-semibold text-[#1A1A1A] mb-1">
          🪨 Want to see this stone in person?
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Request a physical {categoryName ? `${categoryName.toLowerCase()} ` : ''}sample — shipped worldwide. Most samples arrive within 7–10 business days.
        </p>
      </div>
      <button
        onClick={onRequest}
        className="flex-shrink-0 px-5 py-2.5 border-2 border-[#B8962E] text-[#B8962E] font-semibold text-sm hover:bg-[#B8962E] hover:text-white transition-all duration-200 whitespace-nowrap rounded-sm"
      >
        Request a Sample →
      </button>
    </div>
  )
}
