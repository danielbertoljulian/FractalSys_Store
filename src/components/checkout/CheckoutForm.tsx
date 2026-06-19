"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart-store"
import { openWhatsAppOrder, type CustomerData } from "@/lib/whatsapp"
import { formatCurrency } from "@/lib/formatCurrency"
import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function CheckoutForm() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const total = getTotal()

  const [customer, setCustomer] = useState<CustomerData>({
    name: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
  })
  const [sending, setSending] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!customer.name.trim()) errs.name = "Nome é obrigatório"
    if (!customer.phone.trim()) errs.phone = "Telefone é obrigatório"
    if (!customer.city.trim()) errs.city = "Cidade é obrigatória"
    if (!customer.address.trim()) errs.address = "Endereço é obrigatório"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    if (items.length === 0) return

    setSending(true)

    const cartItems = items.map((item) => ({
      name: item.name,
      price: item.promotionalPrice ?? item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }))

    openWhatsAppOrder(cartItems, customer, total)

    setTimeout(() => {
      clearCart()
      router.push("/pedido-confirmado")
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <p className="text-xl mb-4">Carrinho vazio</p>
        <a
          href="/produtos"
          className="text-accent-cyan hover:underline"
        >
          Ver produtos
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h3
          className={`text-lg font-semibold text-accent-cyan ${orbitron.className}`}
        >
          Resumo do Pedido
        </h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex justify-between text-sm p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
            >
              <div>
                <span className="text-white">{item.name}</span>
                <span className="text-zinc-500 ml-2">
                  {item.size} | {item.color}
                </span>
                <span className="text-zinc-500 ml-2">x{item.quantity}</span>
              </div>
              <span className="text-accent-cyan font-semibold">
                {formatCurrency(
                  (item.promotionalPrice ?? item.price) * item.quantity,
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-800">
          <span className="text-zinc-400">Total</span>
          <span className="text-accent-cyan">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3
          className={`text-lg font-semibold text-accent-cyan ${orbitron.className}`}
        >
          Dados do Cliente
        </h3>

        <div>
          <input
            type="text"
            placeholder="Nome completo *"
            value={customer.name}
            onChange={(e) =>
              setCustomer((c) => ({ ...c, name: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-accent-cyan focus:outline-none transition-colors"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="WhatsApp com DDD *"
            value={customer.phone}
            onChange={(e) =>
              setCustomer((c) => ({ ...c, phone: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-accent-cyan focus:outline-none transition-colors"
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Cidade *"
            value={customer.city}
            onChange={(e) =>
              setCustomer((c) => ({ ...c, city: e.target.value }))
            }
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-accent-cyan focus:outline-none transition-colors"
          />
          {errors.city && (
            <p className="text-red-400 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Endereço completo (rua, número, bairro, CEP) *"
            value={customer.address}
            onChange={(e) =>
              setCustomer((c) => ({ ...c, address: e.target.value }))
            }
            rows={2}
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-accent-cyan focus:outline-none transition-colors resize-none"
          />
          {errors.address && (
            <p className="text-red-400 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Observações (opcional)"
            value={customer.notes || ""}
            onChange={(e) =>
              setCustomer((c) => ({ ...c, notes: e.target.value }))
            }
            rows={2}
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-accent-cyan focus:outline-none transition-colors resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full px-8 py-4 rounded-lg bg-accent-cyan text-black font-bold text-lg hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "Enviando..." : "Enviar Pedido pelo WhatsApp"}
      </button>

      <p className="text-xs text-zinc-600 text-center">
        Ao enviar, você será redirecionado ao WhatsApp para confirmar o pedido.
        O pagamento será combinado diretamente conosco.
      </p>
    </form>
  )
}
