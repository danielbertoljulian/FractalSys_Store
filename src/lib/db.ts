import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

neonConfig.fetchConnectionCache = true;

const url = process.env.DATABASE_URL;

function createDb() {
  if (!url || url.includes('user:password@host:port')) {
    console.warn("⚠️ DATABASE_URL não configurada. API de banco desativada.");
    return null;
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = createDb();
