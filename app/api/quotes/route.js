import { adminAllowed, adminAuthMessage } from '../../../src/server/adminAuth';
import { listQuoteRequests, quotesStorageReady, saveQuoteRequest } from '../../../src/server/quotesStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = {
  'image/jpeg': true,
  'image/png': true,
  'image/webp': true,
};

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

    let artworkPayload = null;
    if (artwork && typeof artwork !== 'string') {
      if (!ALLOWED_TYPES[artwork.type]) {
        return fresh({ error: 'Artwork must be a JPG, PNG, or WEBP file.' }, 400);
      }
      const buffer = Buffer.from(await artwork.arrayBuffer());
      if (!buffer.length || buffer.length > 8 * 1024 * 1024) {
        return fresh({ error: 'Artwork must be under 8 MB.' }, 400);
      }
      artworkPayload = {
        buffer,
        name: artwork.name || 'artwork',
        contentType: artwork.type,
      };
    }

    const record = await saveQuoteRequest({
      name,
      email,
      phone,
      company,
      quantity,
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
