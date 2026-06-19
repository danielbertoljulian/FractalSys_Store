import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products as productsTable } from '@/lib/schema'
import { products as staticProducts } from '@/data/products'
import { eq } from 'drizzle-orm'

function requireDb() {
  if (!db) {
    throw new Error('Database not configured. Set DATABASE_URL environment variable.')
  }
  return db
}

function toBrPrice(value: number): string {
  return value.toFixed(2).replace('.', ',')
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const database = requireDb()
    const existing = await database.select({ slug: productsTable.slug }).from(productsTable)
    const existingSlugs = new Set(existing.map(p => p.slug))

    let inserted = 0
    let skipped = 0

    for (const p of staticProducts) {
      if (existingSlugs.has(p.slug)) {
        skipped++
        continue
      }

      await database.insert(productsTable).values({
        name: p.name,
        slug: p.slug,
        description: p.description,
        brand: p.collection || null,
        categories: p.category,
        colors: p.colors.join(", "),
        price: toBrPrice(p.price),
        off: p.promotionalPrice ? Math.round((1 - p.promotionalPrice / p.price) * 100) : 0,
        image: p.images[0] || null,
        images: JSON.stringify(p.images),
        printType: p.printType || null,
        isActive: p.isActive,
        isFeatured: p.isFeatured || false,
        sortOrder: 0,
      })

      inserted++
    }

    return NextResponse.json({
      ok: true,
      message: `Seed concluído. ${inserted} produtos inseridos, ${skipped} já existentes.`,
      inserted,
      skipped,
    })
  } catch (e: any) {
    console.error('Seed API Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
