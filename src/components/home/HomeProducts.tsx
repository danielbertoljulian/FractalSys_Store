"use client"

import { useState, useEffect } from "react"
import { Orbitron } from "next/font/google"
import Link from "next/link"
import type { Product } from "@/data/products"
import ProductCard from "@/components/products/ProductCard"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

const CATEGORIES = [
  { id: "todas", name: "Todas" },
  { id: "Camisetas", name: "Camisetas" },
  { id: "Oversized", name: "Oversized" },
  { id: "Moletons", name: "Moletons" },
  { id: "Acessórios", name: "Acessórios" },
]

interface HomeProductsProps {
  products: Product[]
}

export default function HomeProducts({ products }: HomeProductsProps) {
  const [filter, setFilter] = useState("todas")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="py-20" />

  const filtered = filter === "todas"
    ? products
    : products.filter(p => p.category.toLowerCase() === filter.toLowerCase())

  return (
    <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-20 md:py-28">
      <div className="text-center mb-14">
        <span className="text-[10px] uppercase tracking-[0.4em] text-cyan-500/60 font-bold">
          Todos os Produtos
        </span>
        <h2 className={`mt-4 text-3xl md:text-5xl font-bold text-white tracking-tight ${orbitron.className}`}>
          CATÁLOGO
        </h2>
        <p className="mt-5 text-zinc-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
          Explore todas as peças da coleção FractalSyS Wear.
        </p>
      </div>

      {/* Inline category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-5 py-2 rounded-full border text-xs transition-all ${
              filter === cat.id
                ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p>Nenhum produto encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-14 text-center">
        <Link
          href="/produtos"
          className={`inline-flex items-center gap-2 px-8 py-3 rounded-full border border-zinc-700 text-zinc-400 hover:border-cyan-500/40 hover:text-cyan-300 transition-all text-sm tracking-widest uppercase ${orbitron.className}`}
        >
          Ver Catalogo Completo
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
