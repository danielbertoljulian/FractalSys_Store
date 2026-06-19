import { put, get, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_KEY = 'admin/products.json';

async function streamToString(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  return text;
}

async function readProducts(): Promise<any[]> {
  try {
    // First try list() to find all blob URLs
    const { blobs } = await list({ prefix: 'admin/' });
    if (blobs.length === 0) return [];
    // Sort by uploadedAt descending and take the latest
    const latest = blobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
    const res = await fetch(latest.url);
    if (!res.ok) return [];
    const text = await res.text();
    return JSON.parse(text);
  } catch (e) {
    console.error('readProducts error:', e);
    return [];
  }
}

async function writeProducts(data: any[]) {
  const result = await put(BLOB_KEY, JSON.stringify(data, null, 2), {
    access: 'private',
    contentType: 'application/json',
  });
  return result;
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
    const writeResult = await writeProducts(products);
    return NextResponse.json({ ...newProduct, blobPath: writeResult.pathname }, { status: 201 });
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
    const writeResult = await writeProducts(filtered);
    return NextResponse.json({ ok: true, pathname: writeResult.pathname });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
