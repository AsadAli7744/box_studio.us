import { randomBytes } from 'crypto';
import { getS3ObjectText, listS3Keys, putS3Object, s3Configured, signedS3Url } from './s3';

const INDEX_KEY = 'quotes/index.json';

function newQuoteId() {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  return `${stamp}-${randomBytes(4).toString('hex')}`;
}

function safeFileName(name = 'artwork') {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'artwork';
}

async function readIndex() {
  try {
    const text = await getS3ObjectText(INDEX_KEY);
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeIndex(entries) {
  await putS3Object({
    key: INDEX_KEY,
    body: JSON.stringify(entries, null, 2),
    contentType: 'application/json',
  });
}

export function quotesStorageReady() {
  return s3Configured();
}

export async function saveQuoteRequest({
  name,
  email,
  phone,
  company,
  notes,
  productSlug,
  productName,
  summary,
  artwork,
}) {
  if (!quotesStorageReady()) {
    throw new Error('Quote storage is not configured. Set AWS S3 environment variables on the server.');
  }

  const id = newQuoteId();
  const createdAt = new Date().toISOString();
  let artworkMeta = null;

  if (artwork?.buffer?.length) {
    const fileName = safeFileName(artwork.name);
    const key = `quotes/${id}/files/${fileName}`;
    await putS3Object({
      key,
      body: artwork.buffer,
      contentType: artwork.contentType || 'application/octet-stream',
    });
    artworkMeta = {
      key,
      name: artwork.name || fileName,
      contentType: artwork.contentType || 'application/octet-stream',
      size: artwork.buffer.length,
    };
  }

  const record = {
    id,
    createdAt,
    name,
    email,
    phone,
    company,
    notes,
    productSlug,
    productName,
    summary,
    artwork: artworkMeta,
    status: 'new',
  };

  await putS3Object({
    key: `quotes/${id}/meta.json`,
    body: JSON.stringify(record, null, 2),
    contentType: 'application/json',
  });

  const index = await readIndex();
  index.unshift({
    id,
    createdAt,
    name,
    email,
    phone,
    productSlug,
    productName,
    hasArtwork: Boolean(artworkMeta),
    status: 'new',
  });
  await writeIndex(index.slice(0, 2000));

  return record;
}

export async function listQuoteRequests() {
  if (!quotesStorageReady()) {
    throw new Error('Quote storage is not configured. Set AWS S3 environment variables on the server.');
  }

  const index = await readIndex();
  if (index.length) return index;

  // Fallback if index is missing: discover meta.json objects.
  const keys = await listS3Keys('quotes/');
  const metaKeys = keys.filter((key) => key.endsWith('/meta.json'));
  const records = [];
  for (const key of metaKeys) {
    try {
      const record = JSON.parse(await getS3ObjectText(key));
      records.push({
        id: record.id,
        createdAt: record.createdAt,
        name: record.name,
        email: record.email,
        phone: record.phone,
        productSlug: record.productSlug,
        productName: record.productName,
        hasArtwork: Boolean(record.artwork),
        status: record.status || 'new',
      });
    } catch {
      // Skip unreadable records.
    }
  }
  records.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return records;
}

export async function getQuoteRequest(id) {
  if (!quotesStorageReady()) {
    throw new Error('Quote storage is not configured. Set AWS S3 environment variables on the server.');
  }
  const safeId = String(id || '').replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safeId) throw new Error('Quote not found.');
  const text = await getS3ObjectText(`quotes/${safeId}/meta.json`);
  return JSON.parse(text);
}

export async function getQuoteArtworkUrl(id) {
  const record = await getQuoteRequest(id);
  if (!record.artwork?.key) throw new Error('This quote has no artwork file.');
  const url = await signedS3Url(record.artwork.key, 60 * 20);
  return {
    url,
    name: record.artwork.name,
    contentType: record.artwork.contentType,
  };
}
