import { notFound } from "next/navigation"
import { Orbitron } from "next/font/google"
import ProductGallery from "@/components/products/ProductGallery"
import ProductInfo from "@/components/products/ProductInfo"
import { db } from "@/lib/db"
import { products as productsTable } from "@/lib/schema"
import { eq, or, like } from "drizzle-orm"
import { products as staticProducts } from "@/data/products"
import { parseBrPrice } from "@/lib/formatCurrency"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

function toSlug(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

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
  const normalizedSlug = toSlug(slug);

  if (!db) {
    return staticProducts.find((p) => p.slug === normalizedSlug || p.slug === slug);
  }

  try {
    const productData = await db.select()
      .from(productsTable)
      .where(or(eq(productsTable.slug, normalizedSlug), eq(productsTable.slug, slug)))
      .limit(1)

    if (!productData || productData.length === 0) {
      return staticProducts.find((p) => p.slug === normalizedSlug || p.slug === slug);
    }

    const p = productData[0]
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
  } catch {
    return staticProducts.find((p) => p.slug === normalizedSlug || p.slug === slug);
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
