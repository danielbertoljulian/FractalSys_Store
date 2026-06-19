const BLOB_DOMAIN = 'nppry8uy2tuedhpb.private.blob.vercel-storage.com';

export function getImageUrl(src: string): string {
  if (!src) return '/products/placeholder.svg';
  if (src.includes(BLOB_DOMAIN)) {
    return `/api/image?url=${encodeURIComponent(src)}`;
  }
  return src;
}
