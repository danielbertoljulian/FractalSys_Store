import { Orbitron } from "next/font/google"
import HeroStore from "@/components/home/HeroStore"
import FeaturedCollection from "@/components/home/FeaturedCollection"
import BrandSection from "@/components/home/BrandSection"
import { db } from "@/lib/db"
import { products as productsTable } from "@/lib/schema"
import { eq, and, desc } from "drizzle-orm"
import { getFeaturedProducts as getStaticFeaturedProducts, collections } from "@/data/products"
import { parseBrPrice } from "@/lib/formatCurrency"
import Galaxy from "@/components/Galaxy"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export const revalidate = 60 // Revalidate every minute

async function getFeaturedProducts() {
  if (!db) {
    console.info("Info: Usando dados estáticos (DB não configurado)");
    return getStaticFeaturedProducts();
  }

  try {
    const fetched = await db.select()
      .from(productsTable)
      .where(and(eq(productsTable.isActive, true), eq(productsTable.isFeatured, true)))
      .orderBy(desc(productsTable.sortOrder), desc(productsTable.id))
    
    return fetched.map(p => ({
      ...p,
      id: p.id.toString(),
      description: p.description || "",
      images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
      price: parseBrPrice(p.price),
      promotionalPrice: p.off ? (parseBrPrice(p.price) * (1 - p.off / 100)) : undefined,
      sizes: ["P", "M", "G", "GG", "XG"],
      colors: (p.colors || "").split(", ").filter(Boolean),
      category: p.categories || "Geral",
      collection: p.brand || ""
    }))
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return getStaticFeaturedProducts();
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  const genesisCollection = collections.find((c) => c.slug === "genesis-drop-01") || collections[0]

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
            products={featuredProducts as any}
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
