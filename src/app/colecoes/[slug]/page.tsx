import { notFound } from "next/navigation"
import { Orbitron } from "next/font/google"
import { collections, getProductsByCollection } from "@/data/products"
import type { Product } from "@/data/products"
import ProductGrid from "@/components/products/ProductGrid"
import { db } from "@/lib/db"
import { products as productsTable } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { parseBrPrice } from "@/lib/formatCurrency"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

async function getProductsByCollectionSlug(slug: string) {
  const collection = collections.find((c) => c.slug === slug)
  if (!collection) return []

  if (!db) return getProductsByCollection(slug)

  try {
    const fetched = await db.select()
      .from(productsTable)
      .where(eq(productsTable.isActive, true))

    const dbProducts = fetched
      .filter(p => p.brand === collection.name || p.categories?.toLowerCase().includes(collection.name.toLowerCase()))
      .map(p => ({
        ...p,
        id: p.id.toString(),
        description: p.description || "",
        images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
        price: parseBrPrice(p.price),
        promotionalPrice: p.off ? (parseBrPrice(p.price) * (1 - p.off / 100)) : undefined,
        sizes: ["P", "M", "G", "GG", "XG"],
        colors: (p.colors || "").split(", ").filter(Boolean),
        category: p.categories || "Geral",
        collection: p.brand || "",
      }))

    if (dbProducts.length > 0) return dbProducts
  } catch (error) {
    console.error("Error fetching collection products:", error)
  }

  return getProductsByCollection(slug)
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const collection = collections.find((c) => c.slug === slug)

  if (!collection) {
    notFound()
  }

  const collectionProducts = await getProductsByCollectionSlug(slug)

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-accent-cyan/60">
            Coleção
          </span>
          <h1
            className={`mt-4 text-3xl md:text-5xl font-bold text-white ${orbitron.className}`}
          >
            {collection.name}
          </h1>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {collection.description}
          </p>
        </div>

        <ProductGrid products={collectionProducts as any} />

        {collectionProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <p>Em breve novos produtos.</p>
          </div>
        )}
      </div>
    </div>
  )
}
