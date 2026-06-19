import { Orbitron } from "next/font/google"
import CheckoutForm from "@/components/checkout/CheckoutForm"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function CheckoutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.3em] text-accent-cyan/60">
            FractalSyS Store
          </span>
          <h1
            className={`mt-4 text-3xl md:text-4xl font-bold text-white ${orbitron.className}`}
          >
            Finalizar Pedido
          </h1>
          <p className="mt-3 text-zinc-400">
            Preencha os dados abaixo para enviar seu pedido pelo WhatsApp
          </p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  )
}
