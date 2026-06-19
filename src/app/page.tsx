import dynamic from "next/dynamic"
import { Orbitron } from "next/font/google"
import HeroStore from "@/components/home/HeroStore"
import FeaturedCollection from "@/components/home/FeaturedCollection"
import BrandSection from "@/components/home/BrandSection"
import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { eq, and, desc } from "drizzle-orm"

import Galaxy from "@/components/Galaxy"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export const revalidate = 60 // Revalidate every minute

async function getFeaturedProducts() {
  if (!db) return []
  try {
    return await db.select()
      .from(products)
      .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
      .orderBy(desc(products.sortOrder), desc(products.id))
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  
  // Transform DB products to match the component expectations if necessary
  const formattedProducts = featuredProducts.map(p => ({
    ...p,
    id: p.id.toString(),
    images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
    price: parseFloat(p.price || "0"),
    promotionalPrice: p.off ? (parseFloat(p.price || "0") * (1 - p.off / 100)) : undefined,
    sizes: ["P", "M", "G", "GG", "XG"], // Fallback sizes
    colors: (p.colors || "").split(", "),
    category: p.categories || "Geral",
    collection: p.brand || ""
  }))

  return (
    <div className="relative min-h-screen">
      {/* Galaxy starfield background */}
      <Galaxy
        hueShift={180}
        density={0.4}
        saturation={0.6}
        glowIntensity={0.4}
        twinkleIntensity={0.5}
        rotationSpeed={0.03}
        repulsionStrength={2.5}
        transparent={true}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <HeroStore />

        {formattedProducts.length > 0 && (
          <FeaturedCollection
            products={formattedProducts as any}
            collectionName="Genesis"
            collectionSlug="genesis"
            description="A primeira coleção FractalSyS Wear traduz código, inteligência artificial, fractais e cultura digital em peças premium."
          />
        )}

        <BrandSection />
      </div>
    </div>
  )
}
