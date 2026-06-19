import { Orbitron } from "next/font/google"
import { categories } from "@/data/products"
import ProductGrid from "@/components/products/ProductGrid"
import { db } from "@/lib/db"
import { products as productsTable } from "@/lib/schema"
import { desc, eq, and } from "drizzle-orm"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export const revalidate = 60

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category = "todas" } = await searchParams
  
  let productsQuery;
  if (category === "todas") {
    productsQuery = db.select().from(productsTable).where(eq(productsTable.isActive, true))
  } else {
    productsQuery = db.select().from(productsTable).where(
      and(eq(productsTable.isActive, true), eq(productsTable.categories, category))
    )
  }
  
  const fetchedProducts = await productsQuery.orderBy(desc(productsTable.sortOrder), desc(productsTable.id))

  const formattedProducts = fetchedProducts.map(p => ({
    ...p,
    id: p.id.toString(),
    images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
    price: parseFloat(p.price || "0"),
    promotionalPrice: p.off ? (parseFloat(p.price || "0") * (1 - p.off / 100)) : undefined,
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: (p.colors || "").split(", "),
    category: p.categories || "Geral",
    collection: p.brand || ""
  }))

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

        <ProductGrid products={formattedProducts as any} />

        {formattedProducts.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <p>Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
