"use client"

import Link from "next/link"
import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function OrderConfirmedPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-lg mx-auto px-4 text-center py-20">
        <div className="text-6xl mb-6">🎉</div>
        <h1
          className={`text-3xl md:text-4xl font-bold text-white mb-4 ${orbitron.className}`}
        >
          Pedido Enviado!
        </h1>
        <p className="text-zinc-400 leading-relaxed mb-8">
          Seu pedido foi encaminhado para nossa equipe pelo WhatsApp.
          Em breve entraremos em contato para confirmar o pagamento e
          os detalhes da produção.
        </p>
        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/produtos"
            className="px-8 py-3 rounded-lg bg-accent-cyan text-black font-bold hover:bg-cyan-300 transition-colors"
          >
            Continuar Comprando
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-accent-cyan transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  )
}
