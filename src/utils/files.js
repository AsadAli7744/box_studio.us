export const MAX_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_FILES = 6;

const ACCEPT = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
};

export const FILE_ACCEPT = Object.values(ACCEPT)
  .filter((type, index, list) => list.indexOf(type) === index)
  .join(',');

export function fileKind(file) {
  if (file.type && ACCEPT[extensionOf(file.name)] === file.type) return file.type;
  if (file.type && Object.values(ACCEPT).includes(file.type)) return file.type;
  return ACCEPT[extensionOf(file.name)] || '';
}

function extensionOf(name) {
  const parts = String(name || '').toLowerCase().split('.');
  return parts.length > 1 ? parts.pop() : '';
}

export function isImageType(type) {
  return type === 'image/jpeg' || type === 'image/png' || type === 'image/webp';
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateIncomingFile(file, existingCount) {
  const kind = fileKind(file);
  if (!kind) return `${file.name} needs to be a JPG, PNG, WEBP, or PDF.`;
  if (file.size > MAX_FILE_BYTES) return `${file.name} is larger than 8 MB.`;
  if (existingCount >= MAX_FILES) return `You can add up to ${MAX_FILES} files.`;
  return '';
}
