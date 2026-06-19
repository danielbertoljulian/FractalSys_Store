"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Orbitron } from "next/font/google"
import type { Product } from "@/data/products"
import { formatCurrency } from "@/lib/formatCurrency"
import { useCartStore } from "@/store/cart-store"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["500", "600", "700"] })

const PLACEHOLDER = "/products/placeholder.svg"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      promotionalPrice: product.promotionalPrice,
      image: product.images[0] || "",
      size: product.sizes[0],
      color: product.colors[0],
    })
    openCart()
  }

  const discountPct = product.promotionalPrice
    ? Math.round(((product.price - product.promotionalPrice) / product.price) * 100)
    : null

  const imgSrc = !imgError && product.images[0] ? product.images[0] : PLACEHOLDER

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group relative rounded-2xl bg-zinc-900/40 border border-zinc-800 overflow-hidden transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_40px_-8px_rgba(6,182,212,0.2)] hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-zinc-800/50 overflow-hidden">
        {product.images[0] || imgError ? (
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            onError={() => setImgError(true)}
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-mono">
            [ Em Breve ]
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discountPct && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-500/90 text-white tracking-wider">
              -{discountPct}%
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 tracking-wider">
              DESTAQUE
            </span>
          )}
        </div>

        {/* Quick-add button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-cyan-500/90 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.5)]"
          aria-label="Adicionar ao carrinho"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-500/60 font-bold">
            {product.collection || product.category}
          </span>
          {product.printType && (
            <span className="text-[9px] uppercase tracking-wider text-zinc-600 font-mono border border-zinc-700 rounded px-1.5 py-0.5">
              {product.printType}
            </span>
          )}
        </div>

        <h3 className={`text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-tight ${orbitron.className}`}>
          {product.name}
        </h3>

        <div className="flex items-center gap-2 pt-1">
          {product.promotionalPrice ? (
            <>
              <span className="text-base font-bold text-cyan-400">
                {formatCurrency(product.promotionalPrice)}
              </span>
              <span className="text-xs text-zinc-600 line-through">
                {formatCurrency(product.price)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-cyan-400">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Size chips */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {product.sizes.slice(0, 4).map((s) => (
              <span key={s} className="text-[9px] px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-500 font-mono">
                {s}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-zinc-700 text-zinc-600 font-mono">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom glow line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  )
}
