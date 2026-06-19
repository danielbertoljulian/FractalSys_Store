import { notFound } from "next/navigation"
import { Orbitron } from "next/font/google"
import { collections, getProductsByCollection } from "@/data/products"
import ProductGrid from "@/components/products/ProductGrid"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = params as unknown as { slug: string }
  const collection = collections.find((c) => c.slug === slug)

  if (!collection) {
    notFound()
  }

  const collectionProducts = getProductsByCollection(slug)

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

        <ProductGrid products={collectionProducts} />

        {collectionProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <p>Em breve novos produtos.</p>
          </div>
        )}
      </div>
    </div>
  )
}
