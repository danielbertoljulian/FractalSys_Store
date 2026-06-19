import { pgTable, serial, text, timestamp, integer, boolean, jsonb, date } from 'drizzle-orm/pg-core';

export const products = pgTable('store_products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  brand: text('brand'),
  categories: text('categories'),
  width: text('width'),
  height: text('height'),
  depth: text('depth'),
  colors: text('colors'),
  price: text('price'),
  off: integer('off').default(0),
  image: text('image'),
  images: text('images').default('[]'),
  printType: text('print_type'),
  sortOrder: integer('sort_order').default(0),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const analytics = pgTable('store_analytics', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  productId: integer('product_id'),
  productName: text('product_name'),
  path: text('path'),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const dailyReports = pgTable('store_daily_reports', {
  id: serial('id').primaryKey(),
  date: date('date').notNull().unique(),
  visitsTotal: integer('visits_total').default(0),
  clicksTotal: integer('clicks_total').default(0),
  topProducts: jsonb('top_products').default('[]'),
  createdAt: timestamp('created_at').defaultNow(),
});
