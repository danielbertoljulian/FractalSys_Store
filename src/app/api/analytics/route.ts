import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { analytics, dailyReports } from '@/lib/schema'
import { eq, sql, desc, and, gte, lte } from 'drizzle-orm'

function requireDb() {
  if (!db) {
    throw new Error('Database not configured. Set DATABASE_URL environment variable.')
  }
  return db
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, product_id, product_name, path, referrer } = body

    await requireDb().insert(analytics).values({
      type: type || 'visit',
      productId: product_id || null,
      productName: product_name || null,
      path: path || null,
      referrer: referrer || null,
      userAgent: req.headers.get('user-agent') || null,
    })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10)
    const all = url.searchParams.get('all')

    if (all) {
      const reports = await requireDb().select().from(dailyReports).orderBy(desc(dailyReports.date))
      return NextResponse.json(reports)
    }

    // Aggregate today's analytics
    const dayStart = new Date(date + 'T00:00:00Z')
    const dayEnd = new Date(date + 'T23:59:59Z')

    const visits = await requireDb().select({ count: sql<number>`count(*)` })
      .from(analytics)
      .where(and(
        eq(analytics.type, 'visit'),
        gte(analytics.createdAt, dayStart),
        lte(analytics.createdAt, dayEnd)
      ))

    const clicks = await requireDb().select({ count: sql<number>`count(*)` })
      .from(analytics)
      .where(and(
        eq(analytics.type, 'click'),
        gte(analytics.createdAt, dayStart),
        lte(analytics.createdAt, dayEnd)
      ))

    const topProducts = await requireDb()
      .select({
        product_id: analytics.productId,
        product_name: analytics.productName,
        clicks: sql<number>`count(*)`
      })
      .from(analytics)
      .where(and(
        eq(analytics.type, 'click'),
        gte(analytics.createdAt, dayStart),
        lte(analytics.createdAt, dayEnd)
      ))
      .groupBy(analytics.productId, analytics.productName)
      .orderBy(desc(sql`count(*)`))
      .limit(10)

    return NextResponse.json({
      date,
      visits: { total: Number(visits[0]?.count ?? 0) },
      clicks: { total: Number(clicks[0]?.count ?? 0), topProducts }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
