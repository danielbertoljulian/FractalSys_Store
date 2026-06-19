import { Orbitron } from "next/font/google"
import HeroStore from "@/components/home/HeroStore"
import FeaturedCollection from "@/components/home/FeaturedCollection"
import HomeProducts from "@/components/home/HomeProducts"
import BrandSection from "@/components/home/BrandSection"
import { db } from "@/lib/db"
import { products as productsTable } from "@/lib/schema"
import { eq, and, desc } from "drizzle-orm"
import { getFeaturedProducts as getStaticFeaturedProducts, products as staticProducts, collections } from "@/data/products"
import { parseBrPrice } from "@/lib/formatCurrency"
import Galaxy from "@/components/Galaxy"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export const revalidate = 60

function mapDbProduct(p: any) {
  let gallery = [];
  try {
    gallery = typeof p.images === 'string' ? JSON.parse(p.images) : (Array.isArray(p.images) ? p.images : []);
  } catch (e) {
    gallery = [];
  }
  
  // Garantir que a imagem principal esteja na galeria se não estiver lá
  if (p.image && !gallery.includes(p.image)) {
    gallery = [p.image, ...gallery];
  }

  return {
    ...p,
    id: p.id.toString(),
    description: p.description || "",
    images: gallery,
    price: parseBrPrice(p.price),
    promotionalPrice: p.off ? (parseBrPrice(p.price) * (1 - p.off / 100)) : undefined,
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: (p.colors || "").split(", ").filter(Boolean),
    category: p.categories || "Geral",
    collection: p.brand || ""
  }
}

async function getFeaturedProducts() {
  if (!db) return getStaticFeaturedProducts();
  try {
    const fetched = await db.select()
      .from(productsTable)
      .where(and(eq(productsTable.isActive, true), eq(productsTable.isFeatured, true)))
      .orderBy(desc(productsTable.sortOrder), desc(productsTable.id))
    return fetched.map(mapDbProduct)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return getStaticFeaturedProducts();
  }
}

async function getAllProducts() {
  if (!db) return staticProducts.filter(p => p.isActive);
  try {
    const fetched = await db.select()
      .from(productsTable)
      .where(eq(productsTable.isActive, true))
      .orderBy(desc(productsTable.sortOrder), desc(productsTable.id))
    return fetched.map(mapDbProduct)
  } catch (error) {
    console.error("Error fetching all products:", error)
    return staticProducts.filter(p => p.isActive);
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  const allProducts = await getAllProducts()
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

        <HomeProducts products={allProducts as any} />

        <BrandSection />
      </div>
    </div>
  )
}
