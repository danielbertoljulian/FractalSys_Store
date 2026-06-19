export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  promotionalPrice?: number
  category: string
  collection?: string
  images: string[]
  sizes: string[]
  colors: string[]
  printType?: 'DTF' | 'DTG' | 'Silk' | 'Sublimação'
  isFeatured?: boolean
  isActive: boolean
}

export const products: Product[] = [
  {
    id: "fractal-core-tee",
    slug: "fractal-core-tee",
    name: "Fractal Core Tee",
    description: "Camiseta premium com arte fractal exclusiva da FractalSyS. Estampa que representa a essência dos sistemas fractais aplicados à tecnologia.",
    price: 119.90,
    category: "Camisetas",
    collection: "Genesis",
    images: [
      "/products/fractal-core/front.png",
      "/products/fractal-core/back.png",
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "digital-evolution-tee",
    slug: "digital-evolution-tee",
    name: "Digital Evolution Tee",
    description: "Camiseta que simboliza a evolução digital. Design inspirado em código binário e inteligência artificial.",
    price: 119.90,
    category: "Camisetas",
    collection: "Genesis",
    images: [
      "/products/digital-evolution/front.png",
      "/products/digital-evolution/back.png",
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "code-the-future-tee",
    slug: "code-the-future-tee",
    name: "Code the Future Tee",
    description: "Para quem escreve o futuro em linhas de código. Camiseta com estampa tipográfica tecnológica.",
    price: 109.90,
    category: "Camisetas",
    collection: "Genesis",
    images: [
      "/products/code-the-future/front.png",
      "/products/code-the-future/back.png",
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "ai-agents-hoodie",
    slug: "ai-agents-hoodie",
    name: "AI Agents Hoodie",
    description: "Moletom premium com estampa exclusiva dos Agentes de IA FractalSyS. Conforto e estilo para quem vive tecnologia.",
    price: 229.90,
    promotionalPrice: 199.90,
    category: "Moletons",
    collection: "Genesis",
    images: [
      "/products/ai-agents/front.png",
      "/products/ai-agents/back.png",
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Cinza Chumbo"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "orderflow-tee",
    slug: "orderflow-tee",
    name: "OrderFlow Tee",
    description: "Camiseta inspirada no sistema OrderFlow. Para traders e entusiastas do mercado financeiro.",
    price: 119.90,
    category: "Camisetas",
    collection: "Genesis",
    images: [
      "/products/orderflow/front.png",
      "/products/orderflow/back.png",
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "powered-by-fractalsys-tee",
    slug: "powered-by-fractalsys-tee",
    name: "Powered by FractalSyS Tee",
    description: "Camiseta que exibe a marca FractalSyS com design moderno e minimalista. Ideal para eventos e encontros tech.",
    price: 99.90,
    category: "Camisetas",
    collection: "Genesis",
    images: [
      "/products/powered-by/front.png",
      "/products/powered-by/back.png",
    ],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    id: "genesis-cap",
    slug: "genesis-cap",
    name: "Genesis Drop Cap",
    description: "Boné premium bordado com o logo da coleção Genesis Drop 01. Estilo techwear para completar o visual.",
    price: 89.90,
    category: "Acessórios",
    collection: "Genesis",
    images: [
      "/products/genesis-cap/front.png",
      "/products/genesis-cap/back.png",
    ],
    sizes: ["Único"],
    colors: ["Preto"],
    printType: "DTF",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "fractal-mousepad",
    slug: "fractal-mousepad",
    name: "Fractal Mousepad XXL",
    description: "Mousepad XXL com arte fractal exclusiva. 90x40cm com base antiderrapante e bordas costuradas.",
    price: 79.90,
    category: "Acessórios",
    collection: "Genesis",
    images: [
      "/products/fractal-mousepad/front.png",
    ],
    sizes: ["Único"],
    colors: ["Preto"],
    printType: "Sublimação",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "fractal-mug",
    slug: "fractal-mug",
    name: "FractalSyS Mug",
    description: "Caneca exclusiva FractalSyS com estampa em sublimação. Capacidade 300ml. Ideal para o seu setup.",
    price: 49.90,
    category: "Acessórios",
    collection: "Genesis",
    images: [
      "/products/fractal-mug/front.png",
    ],
    sizes: ["Único"],
    colors: ["Preto"],
    printType: "Sublimação",
    isFeatured: false,
    isActive: true,
  },
  {
    id: "neural-oversized-tee",
    slug: "neural-oversized-tee",
    name: "Neural Oversized Tee",
    description: "Camiseta oversized com arte de rede neural. Modelagem ampla e confortável para o estilo techwear.",
    price: 139.90,
    category: "Oversized",
    collection: "Genesis",
    images: [
      "/products/neural-oversized/front.png",
      "/products/neural-oversized/back.png",
    ],
    sizes: ["M", "G", "GG"],
    colors: ["Preto"],
    printType: "DTF",
    isFeatured: false,
    isActive: true,
  },
]

export const categories = [
  { id: "todas", name: "Todas", icon: "✦" },
  { id: "Camisetas", name: "Camisetas", icon: "👕" },
  { id: "Oversized", name: "Oversized", icon: "👕" },
  { id: "Moletons", name: "Moletons", icon: "🧥" },
  { id: "Acessórios", name: "Acessórios", icon: "🎧" },
]

export const collections = [
  {
    id: "genesis",
    name: "Genesis",
    slug: "genesis",
    description: "A primeira coleção FractalSyS Wear traduz código, inteligência artificial, fractais e cultura digital em peças premium para quem vive tecnologia.",
    releaseDate: "2026-06",
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "todas" || !category) return products.filter((p) => p.isActive)
  return products.filter((p) => p.isActive && p.category.toLowerCase() === category.toLowerCase())
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured && p.isActive)
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  const collection = collections.find((c) => c.slug === collectionSlug)
  if (!collection) return []
  return products.filter((p) => p.collection === collection.name && p.isActive)
}
