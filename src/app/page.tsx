import { Orbitron } from "next/font/google"
import HeroStore from "@/components/home/HeroStore"
import FeaturedCollection from "@/components/home/FeaturedCollection"
import BrandSection from "@/components/home/BrandSection"
import { getFeaturedProducts, collections } from "@/data/products"
import Galaxy from "@/components/Galaxy"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function Home() {
  const featuredProducts = getFeaturedProducts()
  const genesisCollection = collections.find((c) => c.slug === "genesis-drop-01")

  return (
    <div className="relative min-h-screen">
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

        {genesisCollection && featuredProducts.length > 0 && (
          <FeaturedCollection
            products={featuredProducts}
            collectionName={genesisCollection.name}
            collectionSlug={genesisCollection.slug}
            description={genesisCollection.description}
          />
        )}

        <BrandSection />
      </div>
    </div>
  )
}
