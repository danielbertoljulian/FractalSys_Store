"use client"

import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/store/cart-store"
import { formatCurrency } from "@/lib/formatCurrency"

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCartStore()
  const total = getTotal()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-[101] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
            <h2 className="text-lg font-semibold text-accent-cyan">
              Carrinho ({items.length})
            </h2>
            <button
              onClick={closeCart}
              className="text-zinc-400 hover:text-white transition-colors text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="w-16 h-16 mb-4 opacity-30"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <p className="text-sm">Seu carrinho está vazio</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <span className="text-zinc-600 text-xs">Sem imagem</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produto/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-white hover:text-accent-cyan transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <div className="text-xs text-zinc-500 mt-1 space-x-2">
                      {item.size && <span>{item.size}</span>}
                      {item.color && <span>| {item.color}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity - 1,
                            )
                          }
                          className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 hover:text-white text-sm flex items-center justify-center"
                        >
                          &minus;
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
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
                          className="w-6 h-6 rounded bg-zinc-800 text-zinc-400 hover:text-white text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-accent-cyan">
                        {formatCurrency(
                          (item.promotionalPrice ?? item.price) * item.quantity,
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        removeItem(item.productId, item.size, item.color)
                      }
                      className="text-xs text-red-400 hover:text-red-300 mt-1 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-zinc-800 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total</span>
                <span className="text-lg font-bold text-accent-cyan">
                  {formatCurrency(total)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full text-center px-6 py-3 rounded-lg bg-accent-cyan text-black font-bold hover:bg-cyan-300 transition-colors"
              >
                Finalizar Pedido
              </Link>
              <Link
                href="/produtos"
                onClick={closeCart}
                className="block w-full text-center px-6 py-2 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Continuar Comprando
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
