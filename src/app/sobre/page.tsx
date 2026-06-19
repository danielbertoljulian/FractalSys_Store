import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600", "700"] })

export default function AboutPage() {
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
            Sobre a FractalSyS Wear
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2
              className={`text-xl font-semibold text-accent-cyan ${orbitron.className}`}
            >
              A Marca
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              A FractalSyS Wear nasceu da união entre tecnologia e moda. Somos uma
              extensão da FractalSyS, empresa de soluções digitais especializada em
              desenvolvimento de sistemas, IA e automação.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Cada peça é desenhada para representar a cultura digital, o código, os
              fractais e a inteligência artificial que movem a tecnologia moderna.
            </p>
          </div>

          <div className="space-y-6">
            <h2
              className={`text-xl font-semibold text-accent-cyan ${orbitron.className}`}
            >
              Produção Sob Demanda
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Todas as peças são produzidas sob encomenda, garantindo qualidade
              máxima e mínimo desperdício. Utilizamos estampas DTF de alta
              durabilidade e camisetas 100% algodão penteado.
            </p>
            <p className="text-zinc-400 leading-relaxed">
              Nosso processo é simples: você escolhe, nós produzimos e entregamos.
              Cada peça é única, como seu código.
            </p>
          </div>
        </div>

        <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30">
          <h2
            className={`text-xl font-semibold text-accent-cyan mb-4 ${orbitron.className}`}
          >
            Nossos Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-2">Inovação</h3>
              <p className="text-sm text-zinc-500">
                Cada estampa é pensada para refletir o que há de mais atual em
                tecnologia e cultura digital.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Qualidade</h3>
              <p className="text-sm text-zinc-500">
                Utilizamos materiais premium e estampas de alta durabilidade para
                peças que duram.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Sustentabilidade</h3>
              <p className="text-sm text-zinc-500">
                Produção sob demanda elimina estoques e reduz o impacto ambiental.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
