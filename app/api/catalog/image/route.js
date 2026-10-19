import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

import { adminAllowed, adminAuthMessage } from '../../../../src/server/adminAuth';

export const runtime = 'nodejs';

const types = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function denied() {
  return Response.json({ error: adminAuthMessage() }, { status: 401 });
}

export async function POST(request) {
  if (!adminAllowed(request)) return denied();
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!file || typeof file === 'string') {
      return Response.json({ error: 'Choose an image.' }, { status: 400 });
    }
    const extension = types[file.type];
    if (!extension) {
      return Response.json({ error: 'Use a JPG, PNG, WEBP, or GIF image.' }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!bytes.length || bytes.length > 8 * 1024 * 1024) {
      return Response.json({ error: 'Images need to be under 8 MB.' }, { status: 400 });
    }
    const name = `upload-${Date.now().toString(36)}-${randomBytes(4).toString('hex')}.${extension}`;
    const directory = path.join(process.cwd(), 'public', 'assets');
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, name), bytes);
    return Response.json({ src: `/assets/${name}` });
  } catch (error) {
    return Response.json({ error: error.message || 'The image could not be saved.' }, { status: 400 });
  }
}
