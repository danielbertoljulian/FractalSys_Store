import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  try {
    const { orders } = await req.json()
    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json({ error: 'Orders array required' }, { status: 400 })
    }

    if (!db) throw new Error('Database not connected')
    const database = db;

    // Executa as atualizações em sequência ou paralelo
    await Promise.all(
      orders.map((item: { id: number | string, sortOrder: number }) => 
        database.update(products)
          .set({ sortOrder: item.sortOrder })
          .where(eq(products.id, Number(item.id)))
      )
    )

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Reorder Error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
