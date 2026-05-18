'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: number
  suffix: string
  label: string
  description: string
}

const stats: Stat[] = [
  { value: 600, suffix: '+', label: 'Projects Completed', description: 'Across 30+ countries' },
  { value: 30, suffix: '+', label: 'Years Experience', description: 'Generational craftsmanship' },
  { value: 30, suffix: '+', label: 'Countries Served', description: 'Middle East, Europe & Americas' },
  { value: 100, suffix: '%', label: 'Client Satisfaction', description: 'Quality guaranteed' },
]

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let start = 0
    const step = target / (duration / 16)

    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [active, target, duration])

  return count
}

function StatItem({ stat, index, active }: { stat: Stat; index: number; active: boolean }) {
  const count = useCountUp(stat.value, 1800, active)

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 px-4 text-center relative ${
        index < stats.length - 1
          ? 'border-b border-white/10 md:border-b-0 md:border-r md:border-white/10'
          : ''
      }`}
    >
      <div
        className="font-serif font-bold text-[#B8962E] mb-2 leading-none"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
      >
        {count}
        {stat.suffix}
      </div>
      <div
        className="text-white uppercase tracking-[0.1em] font-semibold mb-1"
        style={{ fontSize: '0.875rem' }}
      >
        {stat.label}
      </div>
      <div className="text-gray-400" style={{ fontSize: '0.8rem' }}>
        {stat.description}
      </div>
    </div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} id="stats" className="bg-[#1A1A1A]">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <StatItem key={i} stat={stat} index={i} active={active} />
        ))}
      </div>
    </section>
  )
}
