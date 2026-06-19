import { Orbitron } from "next/font/google"
import { categories, products as allProducts } from "@/data/products"
import ProductGrid from "@/components/products/ProductGrid"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export const revalidate = 60

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category = "todas" } = await searchParams

  const filtered =
    category === "todas"
      ? allProducts.filter((p) => p.isActive)
      : allProducts.filter(
          (p) =>
            p.isActive &&
            p.category.toLowerCase() === category.toLowerCase(),
        )

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
            Produtos
          </h1>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Explore nossa coleção de peças exclusivas
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={cat.id === "todas" ? "/produtos" : `/produtos?category=${cat.id}`}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                category === cat.id
                  ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
                  : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>

        <ProductGrid products={filtered} />

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <p>Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
