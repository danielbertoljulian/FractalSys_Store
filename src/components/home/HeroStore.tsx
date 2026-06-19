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

      {/* Hero logo with audio-reactive fuzzy effect and background image */}
      <div className="relative w-full max-w-[min(95vw,1100px)] mx-auto px-2 md:px-6 mb-8 flex items-center justify-center">
        {/* Background Image Layer */}
        <div className="absolute inset-0 flex items-center justify-center blur-[1px] scale-110 pointer-events-none">
          <Image
            src="/images/HERO_WIDE_1.png"
            alt="Hero Background"
            width={1200}
            height={600}
            className="object-contain max-h-[70vh] w-auto opacity-90"
            style={{ 
              maskImage: 'radial-gradient(circle, black 30%, transparent 85%)',
              WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 85%)'
            }}
          />
        </div>

        {/* Foreground Active Hero - Movido para cima com translate-y-[-2rem] */}
        <div className="relative z-10 transform -translate-y-12 md:-translate-y-16">
          <AudioReactiveHero
            src="/FRACTALSYS_4K_TRANSP.png"
            alt="FractalSyS Wear"
            width={550}
            height={225}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Text content */}
      <div className={`relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto ${orbitron.className}`}>
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-cyan-500/60 mb-4 font-bold">
          Genesis
        </span>

        <div className="flex flex-col items-center justify-center gap-x-3 gap-y-1 mb-6">
          <FuzzyText
            fontSize="clamp(1.2rem, 4vw, 2.8rem)"
            fontWeight={700}
            baseIntensity={0.03}
            hoverIntensity={0.05}
            enableHover
            color="#F8FAFC"
          >
            FRACTALSYS
          </FuzzyText>
          <FuzzyText
            fontSize="clamp(1.2rem, 4vw, 2.8rem)"
            fontWeight={700}
            baseIntensity={0.03}
            hoverIntensity={0.05}
            enableHover
            gradient={["#06B6D4", "#7C3AED"]}
          >
            STORE
          </FuzzyText>
        </div>

        <div className="max-w-xl mb-10">
          <p className="text-zinc-300 text-sm md:text-lg font-medium tracking-[0.1em] uppercase">
            Para exploradores do impossível.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            href="/produtos"
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
