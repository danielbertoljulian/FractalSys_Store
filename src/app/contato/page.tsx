"use client"

import { Orbitron } from "next/font/google"
import { getWhatsAppUrl } from "@/lib/whatsapp"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-accent-cyan/60">
            FractalSyS
          </span>
          <h1
            className={`mt-4 text-3xl md:text-5xl font-bold text-white ${orbitron.className}`}
          >
            Contato
          </h1>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">
            Tire suas dúvidas ou faça um pedido personalizado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-cyan hover:underline"
                >
                  (51) 99731-9858
                </a>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30">
            <h3 className={`text-lg font-semibold text-accent-cyan mb-6 ${orbitron.className}`}>
              Envie sua mensagem
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Clique no botão abaixo para falar diretamente conosco pelo WhatsApp.
            </p>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-6 py-4 rounded-lg bg-accent-cyan text-black font-bold hover:bg-cyan-300 transition-colors"
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
