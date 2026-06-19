import Link from "next/link"
import { getWhatsAppUrl } from "@/lib/whatsapp"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-accent-cyan mb-4">FractalSyS Wear</h3>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
              Tecnologia, arte digital e identidade futurista em peças exclusivas sob demanda.
              Cada estampa é uma expressão da cultura tech que vestimos.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">
              Navegue
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <Link href="/produtos" className="hover:text-accent-cyan transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/colecoes/genesis-drop-01" className="hover:text-accent-cyan transition-colors">
                  Genesis Drop 01
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-accent-cyan transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-accent-cyan transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-4 uppercase tracking-wider">
              Contato
            </h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-cyan transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://fractalsys.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-cyan transition-colors"
                >
                  FractalSyS
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 text-center text-sm text-zinc-600">
          <p>&copy; {new Date().getFullYear()} FractalSyS Store. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
