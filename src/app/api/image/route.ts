import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_BASE = 'nppry8uy2tuedhpb.private.blob.vercel-storage.com';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    let pathname: string;
    if (url.includes(BLOB_BASE)) {
      pathname = new URL(url).pathname;
    } else {
      pathname = url.startsWith('/') ? url : `/${url}`;
    }

    const result = await get(pathname, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return new NextResponse(result.stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': result.blob.contentType || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Image proxy error' }, { status: 500 });
  }
}
