import { Orbitron } from "next/font/google"
import { categories, products as staticProducts } from "@/data/products"
import ProductGrid from "@/components/products/ProductGrid"
import { db } from "@/lib/db"
import { products as productsTable } from "@/lib/schema"
import { desc, eq, and } from "drizzle-orm"
import { parseBrPrice } from "@/lib/formatCurrency"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

async function getProducts(category: string) {
  if (!db) {
    return category === "todas" 
      ? staticProducts.filter(p => p.isActive)
      : staticProducts.filter(p => p.isActive && p.category.toLowerCase() === category.toLowerCase());
  }

  try {
    let query;
    if (category === "todas") {
      query = db.select().from(productsTable).where(eq(productsTable.isActive, true))
    } else {
      query = db.select().from(productsTable).where(
        and(eq(productsTable.isActive, true), eq(productsTable.categories, category))
      )
    }
    
    const fetched = await query.orderBy(desc(productsTable.sortOrder), desc(productsTable.id))

    return fetched.map(p => {
      let gallery = [];
      try {
        gallery = typeof p.images === 'string' ? JSON.parse(p.images) : (Array.isArray(p.images) ? p.images : []);
      } catch (e) {
        gallery = [];
      }
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
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return staticProducts.filter(p => p.isActive);
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category = "todas" } = await searchParams
  const filtered = await getProducts(category)

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <header className="mb-12">
          <h1 className={`text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter ${orbitron.className}`}>
            PRODUTOS
          </h1>
          <p className="text-zinc-500 max-w-2xl">
            Explore nossa coleção de hardware têxtil. Cada peça é uma extensão da cultura digital e da estética fractal.
          </p>
        </header>

        {/* Categories selector */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/produtos?category=${cat.id}`}
              className={`px-6 py-2 rounded-full border transition-all ${
                category === cat.id
                  ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </a>
          ))}
        </div>

        <ProductGrid products={filtered as any} />

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <p>Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
