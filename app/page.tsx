'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import HeroSection from '@/components/home/HeroSection'
import CraftsmanshipVideo from '@/components/home/CraftsmanshipVideo'
import HeritageSection from '@/components/home/HeritageSection'
import FeaturedProjects from '@/components/home/FeaturedProjects'
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
      
      <CraftsmanshipVideo />
      <HeritageSection />
      <FeaturedProjects />
      <FeaturedProductsSection />
      <CTASection />
    </div>
  )
}
