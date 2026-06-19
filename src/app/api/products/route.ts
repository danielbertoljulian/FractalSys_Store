import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

function requireDb() {
  if (!db) {
    throw new Error('Database not configured. Set DATABASE_URL environment variable.')
  }
  return db
}

export async function GET() {
  try {
    const data = await requireDb().select().from(products).orderBy(desc(products.sortOrder), desc(products.id))
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, slug, description, brand, categories, width, height, depth, colors, price, off, image, images, isFeatured } = body
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })

    const slugValue = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const inserted = await requireDb().insert(products).values({
      name,
      slug: slugValue,
      description: description || null,
      brand: brand || null,
      categories: categories || null,
      width: width || null,
      height: height || null,
      depth: depth || null,
      colors: colors || null,
      price: price || null,
      off: parseInt(off) || 0,
      image: image || null,
      images: typeof images === 'string' ? images : JSON.stringify(images || []),
      isFeatured: Boolean(isFeatured),
      isActive: true,
    }).returning()

    return NextResponse.json(inserted[0], { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, slug, description, brand, categories, width, height, depth, colors, price, off, image, images, isFeatured, isActive } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const updated = await requireDb().update(products).set({
      name,
      slug,
      description: description || null,
      brand: brand || null,
      categories: categories || null,
      width: width || null,
      height: height || null,
      depth: depth || null,
      colors: colors || null,
      price: price || null,
      off: parseInt(off) || 0,
      image: image || null,
      images: typeof images === 'string' ? images : JSON.stringify(images || []),
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    }).where(eq(products.id, Number(id))).returning()

    return NextResponse.json(updated[0])
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await requireDb().delete(products).where(eq(products.id, Number(id)))
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
