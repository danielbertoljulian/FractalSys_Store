import { put, get } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_KEY = 'admin-products.json';

async function readProducts(): Promise<any[]> {
  try {
    const blob = await get(BLOB_KEY);
    if (!blob) return [];
    const text = await blob.text();
    return JSON.parse(text);
  } catch {
    return [];
  }
}

async function writeProducts(data: any[]) {
  await put(BLOB_KEY, JSON.stringify(data, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function GET() {
  try {
    const data = await readProducts();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const products = await readProducts();
    const newProduct = {
      id: Date.now(),
      ...body,
      images: typeof body.images === 'string' ? JSON.parse(body.images) : (body.images || []),
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    await writeProducts(products);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const products = await readProducts();
    const idx = products.findIndex((p: any) => p.id === id || p.id === Number(id));
    if (idx === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    products[idx] = {
      ...products[idx],
      ...body,
      images: typeof body.images === 'string' ? JSON.parse(body.images) : (body.images || products[idx].images || []),
      updatedAt: new Date().toISOString(),
    };
    await writeProducts(products);
    return NextResponse.json(products[idx]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const products = await readProducts();
    const filtered = products.filter((p: any) => p.id !== id && p.id !== Number(id));
    if (filtered.length === products.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    await writeProducts(filtered);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
