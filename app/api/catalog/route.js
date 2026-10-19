import { readCatalog, writeCatalog } from '../../../src/server/catalogFile';
import { publishCatalog } from '../../../src/server/publishCatalog';
import { adminAllowed, adminAuthMessage } from '../../../src/server/adminAuth';

export const runtime = 'nodejs';

function denied() {
  return Response.json({ error: adminAuthMessage() }, { status: 401 });
}

export async function GET(request) {
  if (!adminAllowed(request)) return denied();
  try {
    return Response.json(readCatalog());
  } catch (error) {
    return Response.json({ error: error.message || 'The catalog file could not be read.' }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!adminAllowed(request)) return denied();
  try {
    const body = await request.json();
    const catalog = writeCatalog(body);
    try {
      const publish = await publishCatalog(catalog);
      return Response.json({ ...catalog, publish });
    } catch (error) {
      return Response.json({
        ...catalog,
        publish: { status: 'error', message: error.message || 'The catalog was saved here, but GitHub was not updated.' },
      });
    }
  } catch (error) {
    const message = error instanceof SyntaxError ? 'The catalog was not valid JSON.' : error.message;
    return Response.json({ error: message || 'The catalog could not be saved.' }, { status: 400 });
  }
}
