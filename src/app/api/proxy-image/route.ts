import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing url param', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  // Only allow fetching from our R2 CDN domain
  if (!parsed.hostname.endsWith('.r2.dev')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const upstream = await fetch(url);
  if (!upstream.ok) {
    return new NextResponse('Failed to fetch image', {
      status: upstream.status,
    });
  }

  const contentType =
    upstream.headers.get('Content-Type') ?? 'application/octet-stream';
  const buffer = await upstream.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
