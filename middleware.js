import { NextResponse } from 'next/server';

const APEX_HOST = 'boxstudio.us';
const WWW_ORIGIN = 'https://www.boxstudio.us';

function hostnameOf(host = '') {
  return String(host).split(':')[0].toLowerCase();
}

function isFinalHost(host = '') {
  return hostnameOf(host).replace(/^www\./, '') === APEX_HOST;
}

function isStagingHost(host = '') {
  const normalized = hostnameOf(host);
  return (
    normalized.includes('railway.app') ||
    normalized.includes('localhost') ||
    normalized.includes('127.0.0.1') ||
    normalized.endsWith('.local')
  );
}

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const hostname = hostnameOf(host);

  // Permanent apex → www for every path (not only /).
  if (hostname === APEX_HOST) {
    const destination = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      WWW_ORIGIN,
    );
    return NextResponse.redirect(destination, 301);
  }

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
