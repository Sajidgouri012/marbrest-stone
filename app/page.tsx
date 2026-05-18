'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import CraftsmanshipVideo from '@/components/home/CraftsmanshipVideo'
import HeritageSection from '@/components/home/HeritageSection'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import CraftsmanshipPreview from '@/components/home/CraftsmanshipPreview'
import FeaturedProductsSection from '@/components/home/FeaturedProductsSection'
import CTASection from '@/components/home/CTASection'

export default function Home() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])

  return (
    <div className="overflow-hidden">
      <motion.div style={{ opacity, scale }}>
        <HeroSection />
      </motion.div>

      <StatsBar />
      <CraftsmanshipVideo />
      <HeritageSection />
      <FeaturedProjects />
      <CraftsmanshipPreview />
      <FeaturedProductsSection />
      <CTASection />
    </div>
  )
}
