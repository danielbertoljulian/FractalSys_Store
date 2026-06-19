import type { Metadata } from "next"
import { Geist_Mono, Orbitron } from "next/font/google"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CartDrawer from "@/components/layout/CartDrawer"
import "./globals.css"

const orbitron = Orbitron({
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "FractalSyS Store - Wear Technology",
  description: "Tecnologia, arte digital e identidade futurista em peças exclusivas sob demanda.",
  keywords: ["FractalSyS", "wear", "camisetas", "moletons", "techwear", "roupas tecnologia"],
  robots: "index, follow",
  icons: [{ rel: "icon", url: "/HYPERCUBE_TRANSPARENTE_1.png" }],
  openGraph: {
    title: "FractalSyS Store",
    description: "Tecnologia, arte digital e identidade futurista em peças exclusivas sob demanda.",
    images: [{ url: "/HYPERCUBE_TRANSPARENTE_1.png", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
