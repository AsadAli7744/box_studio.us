import { readCatalog, writeCatalog } from '../../../src/server/catalogFile';
import { publishCatalog } from '../../../src/server/publishCatalog';
import { refreshPublicContent } from '../../../src/server/refreshPublicContent';
import { adminAllowed, adminAuthMessage } from '../../../src/server/adminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function denied() {
  return fresh({ error: adminAuthMessage() }, 401);
}

function fresh(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export async function GET(request) {
  if (!adminAllowed(request)) return denied();
  try {
    return fresh(readCatalog());
  } catch (error) {
    return fresh({ error: error.message || 'The catalog file could not be read.' }, 500);
  }
}

export async function PUT(request) {
  if (!adminAllowed(request)) return denied();
  try {
    const body = await request.json();
    const previous = readCatalog();
    const catalog = writeCatalog(body);
    const refresh = refreshPublicContent({ previous, next: catalog });
    try {
      const publish = await publishCatalog(catalog);
      return fresh({ ...catalog, refresh, publish });
    } catch (error) {
      return fresh({
        ...catalog,
        refresh,
        publish: { status: 'error', message: error.message || 'The catalog was saved here, but GitHub was not updated.' },
      });
    }
  } catch (error) {
    const message = error instanceof SyntaxError ? 'The catalog was not valid JSON.' : error.message;
    return fresh({ error: message || 'The catalog could not be saved.' }, 400);
  }
}
