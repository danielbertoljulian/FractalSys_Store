import { notFound } from "next/navigation"
import { Orbitron } from "next/font/google"
import ProductGallery from "@/components/products/ProductGallery"
import ProductInfo from "@/components/products/ProductInfo"
import { products as staticProducts } from "@/data/products"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export function generateStaticParams() {
  return staticProducts.map((product) => ({ slug: product.slug }))
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const product = staticProducts.find((p) => p.slug === slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <ProductGallery images={product.images} name={product.name} />
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  )
}
