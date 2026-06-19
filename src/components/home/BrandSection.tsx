"use client"

import { Orbitron } from "next/font/google"
import LaserFlow from "@/components/LaserFlow"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

const pillars = [
  {
    icon: "/images/icon-tecnologia.png",
    title: "Tecnologia",
    description: "Cada peça carrega a essência da inovação digital. Estampas inspiradas em código, IA e fractais.",
  },
  {
    icon: "/images/icon-arte.png",
    title: "Arte Digital",
    description: "Designs exclusivos criados pela FractalSyS. Arte que conecta a cultura tech ao streetwear.",
  },
]

export default function BrandSection() {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-20 md:py-28 border-t border-zinc-800/50">
      {/* LaserFlow accent above the section */}
      <div className="relative h-32 mb-12 overflow-hidden rounded-3xl">
        <LaserFlow
          color="#06B6D4"
          wispIntensity={4}
          wispDensity={0.8}
          fogIntensity={0.5}
          verticalSizing={1.5}
          flowStrength={0.3}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold">FractalSyS Wear</span>
          <h2 className={`mt-2 text-2xl md:text-3xl font-bold text-white ${orbitron.className}`}>
            Tecnologia que se veste
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="group p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.2)] flex flex-col items-center text-center"
          >
            <div className="h-32 w-32 mb-8 flex items-center justify-center overflow-visible">
              <img 
                src={pillar.icon} 
                alt={pillar.title} 
                className="max-h-full max-w-full object-contain brightness-110 transform transition-transform duration-500 group-hover:scale-150" 
              />
            </div>
            <h3 className={`text-lg font-semibold text-zinc-200 mb-3 group-hover:text-white transition-colors ${orbitron.className}`}>
              {pillar.title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">{pillar.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
