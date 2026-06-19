import { neon } from '@neondatabase/serverless'

const DATABASE_URL = "postgresql://neondb_owner:npg_YyJvS9sFW7gM@ep-silent-tree-acdg42qd-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
const sql = neon(DATABASE_URL)

const products = [
  {
    slug: "fractal-core-tee",
    name: "Fractal Core Tee",
    description: "Camiseta premium com arte fractal exclusiva da FractalSyS. Estampa que representa a essência dos sistemas fractais aplicados à tecnologia.",
    price: "119.90",
    category: "Camisetas",
    collection: "Genesis",
    images: ["/products/fractal-core/front.png", "/products/fractal-core/back.png"],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "digital-evolution-tee",
    name: "Digital Evolution Tee",
    description: "Camiseta que simboliza a evolução digital. Design inspirado em código binário e inteligência artificial.",
    price: "119.90",
    category: "Camisetas",
    collection: "Genesis",
    images: ["/products/digital-evolution/front.png", "/products/digital-evolution/back.png"],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "code-the-future-tee",
    name: "Code the Future Tee",
    description: "Para quem escreve o futuro em linhas de código. Camiseta com estampa tipográfica tecnológica.",
    price: "109.90",
    category: "Camisetas",
    collection: "Genesis",
    images: ["/products/code-the-future/front.png", "/products/code-the-future/back.png"],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "ai-agents-hoodie",
    name: "AI Agents Hoodie",
    description: "Moletom premium com estampa exclusiva dos Agentes de IA FractalSyS. Conforto e estilo para quem vive tecnologia.",
    price: "229.90",
    category: "Moletons",
    collection: "Genesis",
    images: ["/products/ai-agents/front.png", "/products/ai-agents/back.png"],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Cinza Chumbo"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "orderflow-tee",
    name: "OrderFlow Tee",
    description: "Camiseta inspirada no sistema OrderFlow. Para traders e entusiastas do mercado financeiro.",
    price: "119.90",
    category: "Camisetas",
    collection: "Genesis",
    images: ["/products/orderflow/front.png", "/products/orderflow/back.png"],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "powered-by-fractalsys-tee",
    name: "Powered by FractalSyS Tee",
    description: "Camiseta que exibe a marca FractalSyS com design moderno e minimalista. Ideal para eventos e encontros tech.",
    price: "99.90",
    category: "Camisetas",
    collection: "Genesis",
    images: ["/products/powered-by/front.png", "/products/powered-by/back.png"],
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["Preto", "Branco"],
    printType: "DTF",
    isFeatured: true,
    isActive: true,
  },
  {
    slug: "genesis-cap",
    name: "Genesis Drop Cap",
    description: "Boné premium bordado com o logo da coleção Genesis Drop 01. Estilo techwear para completar o visual.",
    price: "89.90",
    category: "Acessórios",
    collection: "Genesis",
    images: ["/products/genesis-cap/front.png", "/products/genesis-cap/back.png"],
    sizes: ["Único"],
    colors: ["Preto"],
    printType: "DTF",
    isFeatured: false,
    isActive: true,
  },
  {
    slug: "fractal-mousepad",
    name: "Fractal Mousepad XXL",
    description: "Mousepad XXL com arte fractal exclusiva. 90x40cm com base antiderrapante e bordas costuradas.",
    price: "79.90",
    category: "Acessórios",
    collection: "Genesis",
    images: ["/products/fractal-mousepad/front.png"],
    sizes: ["Único"],
    colors: ["Preto"],
    printType: "Sublimação",
    isFeatured: false,
    isActive: true,
  },
  {
    slug: "fractal-mug",
    name: "FractalSyS Mug",
    description: "Caneca exclusiva FractalSyS com estampa em sublimação. Capacidade 300ml. Ideal para o seu setup.",
    price: "49.90",
    category: "Acessórios",
    collection: "Genesis",
    images: ["/products/fractal-mug/front.png"],
    sizes: ["Único"],
    colors: ["Preto"],
    printType: "Sublimação",
    isFeatured: false,
    isActive: true,
  },
  {
    slug: "neural-oversized-tee",
    name: "Neural Oversized Tee",
    description: "Camiseta oversized com arte de rede neural. Modelagem ampla e confortável para o estilo techwear.",
    price: "139.90",
    category: "Oversized",
    collection: "Genesis",
    images: ["/products/neural-oversized/front.png", "/products/neural-oversized/back.png"],
    sizes: ["M", "G", "GG"],
    colors: ["Preto"],
    printType: "DTF",
    isFeatured: false,
    isActive: true,
  },
]

async function seed() {
  console.log('Seeding products...')
  for (const p of products) {
    await sql`
      INSERT INTO store_products (
        name, slug, description, price, categories, brand, image, images, colors, print_type, is_featured, is_active
      ) VALUES (
        ${p.name}, ${p.slug}, ${p.description}, ${p.price}, ${p.category}, ${p.collection}, ${p.images[0]}, ${JSON.stringify(p.images)}, ${p.colors.join(', ')}, ${p.printType}, ${p.isFeatured}, ${p.isActive}
      ) ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        categories = EXCLUDED.categories,
        brand = EXCLUDED.brand,
        image = EXCLUDED.image,
        images = EXCLUDED.images,
        colors = EXCLUDED.colors,
        print_type = EXCLUDED.print_type,
        is_featured = EXCLUDED.is_featured,
        is_active = EXCLUDED.is_active
    `
    console.log(`Seeded: ${p.name}`)
  }
  console.log('Seed completed!')
}

seed().catch(console.error)
