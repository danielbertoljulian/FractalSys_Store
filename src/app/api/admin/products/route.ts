import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'

function normalizeSlug(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

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
    console.error('API Error (GET):', e);
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, slug, description, brand, categories, width, height, depth, colors, price, off, image, images, isFeatured, isActive } = body
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })

    const slugValue = normalizeSlug(slug || name)
    const inserted = await requireDb().insert(products).values({
      name,
      slug: slugValue,
      description: description || null,
      brand: brand || null,
      categories: categories || null,
      width: width || null,
      height: height || null,
      depth: depth || null,
      colors: typeof colors === 'string' ? colors : (Array.isArray(colors) ? colors.join(", ") : null),
      price: price?.toString() || "0",
      off: Number(off) || 0,
      image,
      images: typeof images === 'string' ? images : JSON.stringify(images || []),
      isFeatured: !!isFeatured,
      isActive: isActive !== false,
    }).returning()

    return NextResponse.json(inserted[0], { status: 201 })
  } catch (e: any) {
    console.error('API Error (POST):', e);
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, slug, description, brand, categories, width, height, depth, colors, price, off, image, images, isFeatured, isActive } = body
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
    if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 })
    if (!slug) return NextResponse.json({ error: 'slug is required' }, { status: 400 })

    const targetId = Number(id);
    if (isNaN(targetId)) return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });

    const normalizedSlug = normalizeSlug(slug);

    const updated = await requireDb().update(products).set({
      name,
      slug: normalizedSlug,
      description: description || null,
      brand: brand || null,
      categories: categories || null,
      width: width || null,
      height: height || null,
      depth: depth || null,
      colors: typeof colors === 'string' ? colors : (Array.isArray(colors) ? colors.join(", ") : null),
      price: price?.toString() || "0",
      off: Number(off) || 0,
      image,
      images: typeof images === 'string' ? images : JSON.stringify(images || []),
      isFeatured: !!isFeatured,
      isActive: isActive !== false,
    }).where(eq(products.id, targetId)).returning()

    if (updated.length === 0) return NextResponse.json({ error: 'Product not found in database' }, { status: 404 })
    return NextResponse.json(updated[0])
  } catch (e: any) {
    console.error('API Error (PUT):', e);
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
    console.error('API Error (DELETE):', e);
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH() {
  try {
    const allProducts = await requireDb().select().from(products)
    let fixed = 0
    for (const p of allProducts) {
      const normalized = normalizeSlug(p.slug)
      if (normalized !== p.slug) {
        await requireDb().update(products).set({ slug: normalized }).where(eq(products.id, p.id))
        fixed++
      }
    }
    return NextResponse.json({ fixed, total: allProducts.length })
  } catch (e: any) {
    console.error('API Error (PATCH):', e);
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
