import { neon } from '@neondatabase/serverless'

const DATABASE_URL = "postgresql://neondb_owner:npg_YyJvS9sFW7gM@ep-silent-tree-acdg42qd-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
const sql = neon(DATABASE_URL)

async function setupStoreDB() {
  console.log('Resetting and Creating FractalSys Store tables...')

  await sql`DROP TABLE IF EXISTS store_products`
  await sql`
    CREATE TABLE store_products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      slug TEXT NOT NULL UNIQUE,
      brand TEXT,
      categories TEXT,
      width TEXT,
      height TEXT,
      depth TEXT,
      colors TEXT,
      price TEXT,
      off INTEGER DEFAULT 0,
      image TEXT,
      images TEXT DEFAULT '[]',
      print_type TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('store_products OK')

  await sql`
    CREATE TABLE IF NOT EXISTS store_analytics (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      product_id INTEGER,
      product_name TEXT,
      path TEXT,
      referrer TEXT,
      user_agent TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('store_analytics OK')

  await sql`
    CREATE TABLE IF NOT EXISTS store_daily_reports (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL UNIQUE,
      visits_total INTEGER DEFAULT 0,
      clicks_total INTEGER DEFAULT 0,
      top_products JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
  console.log('store_daily_reports OK')
  console.log('All tables ready!')
}

setupStoreDB().catch(console.error)
