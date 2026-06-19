"use client"

import Link from "next/link"
import Image from "next/image"
import { Orbitron } from "next/font/google"
import { useCartStore } from "@/store/cart-store"
import { formatCurrency } from "@/lib/formatCurrency"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <h1
            className={`text-3xl font-bold text-white mb-6 ${orbitron.className}`}
          >
            Carrinho
          </h1>
          <p className="text-zinc-500 mb-8">Seu carrinho está vazio</p>
          <Link
            href="/produtos"
            className="px-6 py-3 rounded-lg bg-accent-cyan text-black font-bold hover:bg-cyan-300 transition-colors"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1
          className={`text-3xl font-bold text-white mb-8 ${orbitron.className}`}
        >
          Carrinho ({items.length})
        </h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800"
            >
              <Link
                href={`/produto/${item.slug}`}
                className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-zinc-800"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                    Sem imagem
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/produto/${item.slug}`}
                  className="text-white font-medium hover:text-accent-cyan transition-colors"
                >
                  {item.name}
                </Link>
                <div className="text-sm text-zinc-500 mt-1">
                  {item.size} | {item.color}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 bg-zinc-800 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity - 1,
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white"
                    >
                      &minus;
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity + 1,
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-accent-cyan font-semibold">
                    {formatCurrency(
                      (item.promotionalPrice ?? item.price) * item.quantity,
                    )}
                  </span>
                </div>

                <button
                  onClick={() =>
                    removeItem(item.productId, item.size, item.color)
                  }
                  className="text-xs text-red-400 hover:text-red-300 mt-2 transition-colors"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 pt-6 space-y-4">
          <div className="flex justify-between text-lg">
            <span className="text-zinc-400">Total</span>
            <span className="text-2xl font-bold text-accent-cyan">
              {formatCurrency(total)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="block w-full text-center px-8 py-4 rounded-lg bg-accent-cyan text-black font-bold text-lg hover:bg-cyan-300 transition-colors"
          >
            Finalizar Pedido
          </Link>

          <Link
            href="/produtos"
            className="block w-full text-center px-6 py-3 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
