import { NextRequest, NextResponse } from 'next/server';

async function fetchDriveFile(fileId: string, range?: string): Promise<Response> {
  const baseUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const rangeHeaders: HeadersInit = range ? { Range: range } : {};

  let res = await fetch(baseUrl, { headers: rangeHeaders });
  const contentType = res.headers.get('content-type') ?? '';

  // великі файли Drive повертає не одразу, а через проміжну HTML-сторінку
  // з попередженням про перевірку на віруси й токеном confirm
  if (contentType.includes('text/html')) {
    const html = await res.text();
    const match = html.match(/confirm=([0-9A-Za-z_-]+)/);
    const cookie = res.headers.get('set-cookie') ?? '';

    if (match) {
      const confirmUrl = `https://drive.google.com/uc?export=download&confirm=${match[1]}&id=${fileId}`;
      res = await fetch(confirmUrl, {
        headers: {
          ...(cookie ? { Cookie: cookie } : {}),
          ...rangeHeaders,
        },
      });
    }
  }

  return res;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;

  if (!fileId) {
    return NextResponse.json({ message: 'Missing fileId' }, { status: 400 });
  }

  try {
    const range = req.headers.get('range') ?? undefined;
    const res = await fetchDriveFile(fileId, range);

    if (!res.ok || !res.body) {
      return NextResponse.json({ message: 'Failed to fetch file from Drive' }, { status: 502 });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/pdf',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600',
    };
    const contentRange = res.headers.get('content-range');
    const contentLength = res.headers.get('content-length');
    if (contentRange) headers['Content-Range'] = contentRange;
    if (contentLength) headers['Content-Length'] = contentLength;

    return new NextResponse(res.body, {
      status: res.status === 206 ? 206 : 200,
      headers,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
  }
}