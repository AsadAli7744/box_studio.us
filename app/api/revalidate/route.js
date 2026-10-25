import { refreshPublicContent } from '../../../src/server/refreshPublicContent';
import { adminAllowed, adminAuthMessage } from '../../../src/server/adminAuth';
import { readCatalog } from '../../../src/server/catalogFile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function denied() {
  return Response.json({ error: adminAuthMessage() }, { status: 401 });
}

export async function POST(request) {
  if (!adminAllowed(request)) return denied();
  try {
    const body = await request.json().catch(() => ({}));
    const paths = Array.isArray(body.paths) ? body.paths.filter((path) => typeof path === 'string') : [];
    const refresh = refreshPublicContent({
      previous: body.previous,
      next: body.next || readCatalog(),
      paths,
    });
    return Response.json(refresh, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return Response.json({ error: error.message || 'The public cache could not be refreshed.' }, { status: 400 });
  }
}
