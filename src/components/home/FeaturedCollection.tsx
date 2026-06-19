"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Orbitron } from "next/font/google"
import type { Product } from "@/data/products"
import ProductCard from "@/components/products/ProductCard"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

interface FeaturedCollectionProps {
  products: Product[]
  collectionName: string
  collectionSlug: string
  description?: string
}

export default function FeaturedCollection({
  products,
  collectionName,
  collectionSlug,
  description,
}: FeaturedCollectionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="py-20" />

  return (
    <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-20 md:py-28">
      {/* Section header */}
      <div className="text-center mb-14">
        <span className="text-[10px] uppercase tracking-[0.4em] text-cyan-500/60 font-bold">
          Coleção em Destaque
        </span>
        <h2 className={`mt-4 text-3xl md:text-5xl font-bold text-white tracking-tight ${orbitron.className}`}>
          {collectionName}
        </h2>
        {description && (
          <p className="mt-5 text-zinc-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            {description}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-cyan-500/50" />
          <Link
            href="/produtos"
            className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-4 tracking-wide"
          >
            Ver catálogo completo →
          </Link>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-cyan-500/50" />
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both", opacity: 0 }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 text-center">
        <Link
          href="/produtos"
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-full border border-zinc-700 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-300 transition-all text-sm tracking-widest uppercase ${orbitron.className}`}
        >
          Ver Todos os Produtos
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
