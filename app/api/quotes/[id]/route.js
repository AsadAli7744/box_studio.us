import { adminAllowed, adminAuthMessage } from '../../../../src/server/adminAuth';
import { getQuoteRequest, quotesStorageReady } from '../../../../src/server/quotesStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fresh(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export async function GET(request, { params }) {
  if (!adminAllowed(request)) {
    return fresh({ error: adminAuthMessage() }, 401);
  }
  try {
    if (!quotesStorageReady()) {
      return fresh({ error: 'Quote storage is not configured. Set AWS S3 environment variables.' }, 503);
    }
    const { id } = await params;
    const quote = await getQuoteRequest(id);
    return fresh({ quote });
  } catch (error) {
    const missing = /NoSuchKey|not found|The specified key does not exist/i.test(String(error.message || ''));
    return fresh({ error: error.message || 'Quote could not be loaded.' }, missing ? 404 : 500);
  }
}
