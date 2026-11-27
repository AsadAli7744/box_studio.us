import { adminAllowed, adminAuthMessage } from '../../../src/server/adminAuth';
import { listQuoteRequests, quotesStorageReady, saveQuoteRequest } from '../../../src/server/quotesStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = {
  'image/jpeg': true,
  'image/png': true,
  'image/webp': true,
  'application/pdf': true,
  'application/postscript': true,
  'application/illustrator': true,
};

function isAllowedArtwork(file) {
  if (!file || typeof file === 'string') return false;
  if (ALLOWED_TYPES[file.type]) return true;
  const name = String(file.name || '').toLowerCase();
  return name.endsWith('.ai') || name.endsWith('.pdf');
}

function fresh(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export async function GET(request) {
  if (!adminAllowed(request)) {
    return fresh({ error: adminAuthMessage() }, 401);
  }
  try {
    if (!quotesStorageReady()) {
      return fresh({ error: 'Quote storage is not configured. Set AWS S3 environment variables.' }, 503);
    }
    const quotes = await listQuoteRequests();
    return fresh({ quotes });
  } catch (error) {
    return fresh({ error: error.message || 'Quotes could not be loaded.' }, 500);
  }
}

export async function POST(request) {
  try {
    if (!quotesStorageReady()) {
      return fresh({ error: 'Quote storage is not configured yet. Please try again later.' }, 503);
    }

    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const company = String(form.get('company') || '').trim();
    const notes = String(form.get('notes') || '').trim();
    const quantityRaw = String(form.get('quantity') || '').trim();
    const quantity = Number(quantityRaw);
    const productType = String(form.get('productType') || '').trim();
    const length = String(form.get('length') || '').trim();
    const width = String(form.get('width') || '').trim();
    const height = String(form.get('height') || '').trim();
    const unit = String(form.get('unit') || 'mm').trim();
    const dimensionsUnsure = String(form.get('dimensionsUnsure') || '') === '1';
    const materialId = String(form.get('materialId') || '').trim();
    const materialName = String(form.get('materialName') || '').trim();
    const finishIds = String(form.get('finishIds') || '').trim();
    const finishNames = String(form.get('finishNames') || '').trim();
    const sampleRequest = String(form.get('sampleRequest') || '') === '1';
    const productSlug = String(form.get('productSlug') || '').trim();
    const productName = String(form.get('productName') || '').trim();
    const summary = String(form.get('summary') || '').trim();
    const artwork = form.get('artwork');

    if (!name || name.length < 2) {
      return fresh({ error: 'Enter your name.' }, 400);
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fresh({ error: 'Enter a valid email address.' }, 400);
    }
    if (phone && !/^[0-9+().\-\s]{6,}$/.test(phone)) {
      return fresh({ error: 'Enter a valid contact number, or leave it blank.' }, 400);
    }
    if (!email && !phone) {
      return fresh({ error: 'Enter an email or a contact number.' }, 400);
    }
    if (!quantityRaw || !Number.isInteger(quantity) || quantity < 1000) {
      return fresh({ error: 'Enter a quantity of at least 1,000 pcs.' }, 400);
    }
    if (!productType && !productName) {
      return fresh({ error: 'Select a product type.' }, 400);
    }
    if (!materialId && !materialName) {
      return fresh({ error: 'Select a board or material.' }, 400);
    }
    if (!finishIds && !finishNames) {
      return fresh({ error: 'Select at least one finish.' }, 400);
    }
    if (!dimensionsUnsure && (!length || !width || !height)) {
      return fresh({ error: 'Enter internal size, or mark that you are unsure.' }, 400);
    }

    let artworkPayload = null;
    if (artwork && typeof artwork !== 'string') {
      if (!isAllowedArtwork(artwork)) {
        return fresh({ error: 'Artwork must be a JPG, PNG, WEBP, PDF, or AI file.' }, 400);
      }
      const buffer = Buffer.from(await artwork.arrayBuffer());
      if (!buffer.length || buffer.length > 8 * 1024 * 1024) {
        return fresh({ error: 'Artwork must be under 8 MB.' }, 400);
      }
      const lowerName = String(artwork.name || '').toLowerCase();
      const contentType =
        artwork.type ||
        (lowerName.endsWith('.ai')
          ? 'application/postscript'
          : lowerName.endsWith('.pdf')
            ? 'application/pdf'
            : 'application/octet-stream');
      artworkPayload = {
        buffer,
        name: artwork.name || 'artwork',
        contentType,
      };
    }

    const record = await saveQuoteRequest({
      name,
      email,
      phone,
      company,
      quantity,
      productType,
      length,
      width,
      height,
      unit,
      dimensionsUnsure,
      materialId,
      materialName,
      finishIds,
      finishNames,
      sampleRequest,
      notes,
      productSlug,
      productName,
      summary,
      artwork: artworkPayload,
    });

    return fresh({
      ok: true,
      id: record.id,
      delivered: true,
    });
  } catch (error) {
    return fresh({ error: error.message || 'The quote request could not be saved.' }, 500);
  }
}
