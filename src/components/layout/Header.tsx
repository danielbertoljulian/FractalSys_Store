"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useCartStore } from "@/store/cart-store"
import { Orbitron } from "next/font/google"
import AudioControls from "@/components/AudioControls"

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export default function Header() {
  const { getItemCount, openCart } = useCartStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const count = mounted ? getItemCount() : 0

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 group">
          <Image
            src="/FRACTAL_NAVBAR.webp"
            alt="FractalSyS Store"
            width={450}
            height={150}
            className="w-auto group-hover:opacity-80 transition-opacity"
            style={{ height: "clamp(22px, 2vw, 38px)" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm text-zinc-400 items-center">
          <Link href="/" className="hover:text-cyan-400 transition-colors tracking-wide">Início</Link>
          <Link href="/produtos" className="hover:text-cyan-400 transition-colors tracking-wide">Produtos</Link>
          <Link href="/produtos" className="hover:text-cyan-400 transition-colors tracking-wide">Catálogo</Link>
          <Link href="/sobre" className="hover:text-cyan-400 transition-colors tracking-wide">Sobre</Link>
          <Link href="/admin" className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-400 transition-colors font-mono border border-zinc-800 rounded px-2 py-1">Admin</Link>
        </nav>

        {/* Right side: AudioControls + Cart */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <AudioControls />
          </div>

          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/60 transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_16px_rgba(6,182,212,0.2)]"
            aria-label="Carrinho"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyan-500 text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>

          {/* Mobile burger */}
          <button
            className="md:hidden text-zinc-400 p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              {mobileMenuOpen
                ? <path d="M18 6L6 18M6 6l12 12" />
                : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 border-b border-zinc-800 backdrop-blur-xl">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {["/ → Início", "/produtos → Produtos", "/colecoes/genesis-drop-01 → Genesis Drop 01", "/sobre → Sobre"].map((item) => {
              const [href, label] = item.split(" → ")
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-300 hover:text-cyan-400 transition-colors py-1 tracking-wide"
                >
                  {label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-zinc-800">
              <AudioControls />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
