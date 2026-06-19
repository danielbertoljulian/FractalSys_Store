import { notFound } from "next/navigation"
import { Orbitron } from "next/font/google"
import ProductGallery from "@/components/products/ProductGallery"
import ProductInfo from "@/components/products/ProductInfo"
import { db } from "@/lib/db"
import { products as productsTable } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { products as staticProducts } from "@/data/products"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export async function generateStaticParams() {
  if (!db) return staticProducts.map(p => ({ slug: p.slug }));
  
  try {
    const allProducts = await db.select({ slug: productsTable.slug }).from(productsTable)
    return allProducts.map((p) => ({ slug: p.slug }))
  } catch {
    return staticProducts.map(p => ({ slug: p.slug }));
  }
}

async function getProduct(slug: string) {
  if (!db) {
    return staticProducts.find((p) => p.slug === slug);
  }

  try {
    const productData = await db.select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug))
      .limit(1)
    
    if (!productData || productData.length === 0) {
      return staticProducts.find((p) => p.slug === slug);
    }

    const p = productData[0]
    
    return {
      ...p,
      id: p.id.toString(),
      images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
      price: parseFloat(p.price || "0"),
      promotionalPrice: p.off ? (parseFloat(p.price || "0") * (1 - p.off / 100)) : undefined,
      sizes: ["P", "M", "G", "GG", "XG"],
      colors: (p.colors || "").split(", "),
      category: p.categories || "Geral",
      collection: p.brand || "",
      description: p.description || ""
    }
  } catch {
    return staticProducts.find((p) => p.slug === slug);
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product as any} />
        </div>
      </div>
    </div>
  )
}
