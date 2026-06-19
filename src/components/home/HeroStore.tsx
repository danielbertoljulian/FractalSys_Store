"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { Orbitron } from "next/font/google"
import FuzzyText from "@/components/FuzzyText"
import { getWhatsAppUrl } from "@/lib/whatsapp"

const AudioReactiveHero = dynamic(() => import("@/components/AudioReactiveHero"), { ssr: false })

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function HeroStore() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Laser glow ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero logo with audio-reactive fuzzy effect */}
      <div className="relative w-full max-w-[min(95vw,1100px)] mx-auto px-2 md:px-6 mb-2">
        <AudioReactiveHero
          src="/FRACTALSYS_4K_TRANSP.png"
          alt="FractalSyS Wear"
          width={1100}
          height={450}
          className="mx-auto"
        />
      </div>

      {/* Text content */}
      <div className={`relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto ${orbitron.className}`}>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-cyan-500/60 mb-4 font-bold">
          Genesis
        </span>

        <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-6">
          <FuzzyText
            fontSize="clamp(1.1rem, 4.5vw, 3rem)"
            fontWeight={700}
            baseIntensity={0.03}
            hoverIntensity={0.05}
            enableHover
            color="#F8FAFC"
          >
            TECNOLOGIA QUE
          </FuzzyText>
          <FuzzyText
            fontSize="clamp(1.1rem, 4.5vw, 3rem)"
            fontWeight={700}
            baseIntensity={0.03}
            hoverIntensity={0.05}
            enableHover
            gradient={["#06B6D4", "#7C3AED"]}
          >
            SE VESTE
          </FuzzyText>
        </div>

        <p className="max-w-xl text-zinc-400 text-sm md:text-base leading-relaxed mb-10">
          Arte digital, fractais e inteligência artificial traduzidos em peças premium sob demanda.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            href="/colecoes/genesis-drop-01"
            className={`px-8 py-3 rounded-full border border-cyan-400/70 text-cyan-200 hover:border-cyan-300 hover:bg-cyan-500/10 transition-all text-xs tracking-[0.15em] uppercase shadow-[0_0_16px_rgba(6,182,212,0.3)] animate-[glow-pulse-cyan_2.2s_ease-in-out_infinite]`}
          >
            Ver Coleção
          </Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-all text-xs tracking-[0.15em] uppercase"
          >
            Pedido pelo WhatsApp
          </a>
        </div>

      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </section>
  )
}
