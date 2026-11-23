import { NextResponse } from 'next/server';

function isFinalHost(host = '') {
  return host.replace(/^www\./, '').toLowerCase() === 'boxstudio.us';
}

function isStagingHost(host = '') {
  const normalized = host.toLowerCase();
  return (
    normalized.includes('railway.app') ||
    normalized.includes('localhost') ||
    normalized.includes('127.0.0.1') ||
    normalized.endsWith('.local')
  );
}

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING;
  const response = NextResponse.next();

  // Never noindex the final domain. Staging hosts stay closed unless forced open.
  const blockIndexing =
    !isFinalHost(host) &&
    (allowIndexing === 'false' || (allowIndexing !== 'true' && isStagingHost(host)));

  if (blockIndexing) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noimageindex');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|assets/).*)'],
};
