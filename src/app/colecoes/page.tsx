import Link from "next/link"
import { Orbitron } from "next/font/google"
import { collections, products } from "@/data/products"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function CollectionsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-accent-cyan/60">
            FractalSyS Wear
          </span>
          <h1
            className={`mt-4 text-3xl md:text-5xl font-bold text-white ${orbitron.className}`}
          >
            Coleções
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection) => {
            const collectionProducts = products.filter(
              (p) => p.collection === collection.name && p.isActive,
            )
            return (
              <Link
                key={collection.id}
                href={`/colecoes/${collection.slug}`}
                className="group p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-accent-cyan/50 transition-all duration-300"
              >
                <h2
                  className={`text-2xl font-bold text-white group-hover:text-accent-cyan transition-colors ${orbitron.className}`}
                >
                  {collection.name}
                </h2>
                <p className="mt-3 text-zinc-400 text-sm leading-relaxed">
                  {collection.description}
                </p>
                <p className="mt-4 text-accent-cyan text-sm">
                  {collectionProducts.length}{" "}
                  {collectionProducts.length === 1 ? "produto" : "produtos"}{" "}
                  &rarr;
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
