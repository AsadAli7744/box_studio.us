export const MAX_FILE_BYTES = 8 * 1024 * 1024;
export const MAX_FILES = 6;

const ACCEPT = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
  ai: 'application/postscript',
};

const EXTRA_TYPES = {
  'application/illustrator': true,
  'application/pdf': true,
  'image/jpeg': true,
  'image/png': true,
  'image/webp': true,
  'application/postscript': true,
};

export const FILE_ACCEPT = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  '.ai',
  'application/postscript',
  'application/illustrator',
].join(',');

export function fileKind(file) {
  const ext = extensionOf(file.name);
  if (ext === 'ai') return 'application/postscript';
  if (file.type && ACCEPT[ext] === file.type) return file.type;
  if (file.type && EXTRA_TYPES[file.type]) return file.type;
  return ACCEPT[ext] || '';
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
  if (!kind) return `${file.name} needs to be a JPG, PNG, WEBP, PDF, or AI file.`;
  if (file.size > MAX_FILE_BYTES) return `${file.name} is larger than 8 MB.`;
  if (existingCount >= MAX_FILES) return `You can add up to ${MAX_FILES} files.`;
  return '';
}
