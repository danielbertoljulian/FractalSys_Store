import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  try {
    if (!db) throw new Error('Database not configured')

    const body = await req.json()
    const { orders } = body

    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ error: 'orders array is required' }, { status: 400 })
    }

    for (const item of orders) {
      if (!item.id || typeof item.sortOrder !== 'number') continue
      await db.update(products)
        .set({ sortOrder: item.sortOrder })
        .where(eq(products.id, Number(item.id)))
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Reorder API Error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
