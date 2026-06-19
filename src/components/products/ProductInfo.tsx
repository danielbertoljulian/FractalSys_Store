"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart-store"
import { formatCurrency } from "@/lib/formatCurrency"
import { Orbitron } from "next/font/google"
import type { Product } from "@/data/products"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["500", "600", "700"] })

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const price = product.promotionalPrice ?? product.price

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        promotionalPrice: product.promotionalPrice,
        image: product.images[0] || "",
        size: selectedSize,
        color: selectedColor,
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    openCart()
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-accent-cyan/60">
          {product.collection || product.category}
        </span>
        <h1
          className={`mt-2 text-3xl md:text-4xl font-bold text-white ${orbitron.className}`}
        >
          {product.name}
        </h1>
      </div>

      <div className="flex items-baseline gap-3">
        {product.promotionalPrice ? (
          <>
            <span className="text-3xl font-bold text-accent-cyan">
              {formatCurrency(product.promotionalPrice)}
            </span>
            <span className="text-lg text-zinc-500 line-through">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-red-400 font-semibold">
              -
              {Math.round(
                ((product.price - product.promotionalPrice) / product.price) * 100,
              )}
              %
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold text-accent-cyan">
            {formatCurrency(product.price)}
          </span>
        )}
      </div>

      <p className="text-zinc-400 leading-relaxed">{product.description}</p>

      {product.printType && (
        <div className="text-sm text-zinc-500">
          Estampa: <span className="text-zinc-300">{product.printType}</span>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Tamanho: <span className="text-white">{selectedSize}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedSize === size
                    ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Cor: <span className="text-white">{selectedColor}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedColor === color
                    ? "border-accent-cyan bg-accent-cyan/10 text-accent-cyan"
                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg border border-zinc-800">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            &minus;
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            +
          </button>
        </div>

        {added ? (
          <button className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-bold">
            Adicionado ao Carrinho!
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="flex-1 px-6 py-3 rounded-lg bg-accent-cyan text-black font-bold hover:bg-cyan-300 transition-colors"
          >
            Adicionar ao Carrinho
          </button>
        )}
      </div>

      <p className="text-xs text-zinc-600">
        Produto sob demanda. Produzido após a confirmação do pedido.
      </p>
    </div>
  )
}
