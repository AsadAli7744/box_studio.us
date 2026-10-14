import { getOffering } from '../data/offerings';
import { getFinish, getInsert, getMaterial } from '../data/catalog';
import { formatBytes } from './files';
import { formatDimension } from './units';

function line(label, value) {
  return `${label}: ${value || '—'}`;
}

export function buildQuoteSummary(draft) {
  const product = draft.customDesign ? null : getOffering(draft.productSlug);
  const material = getMaterial(draft.materialId);
  const insert = getInsert(draft.insertId);
  const finishes = (draft.finishIds || []).map((id) => getFinish(id)?.name).filter(Boolean);
  const dimensions = draft.dimensionsUnsure
    ? 'Not sure yet'
    : [draft.length, draft.width, draft.height].every((value) => value !== '' && value !== undefined)
      ? `${formatDimension(draft.length, draft.unit)} × ${formatDimension(draft.width, draft.unit)} × ${formatDimension(draft.height, draft.unit)} (internal length × width × height)`
      : '—';
  const quantity = draft.quantityGuidance ? 'Guidance requested' : draft.quantity || '—';
  const files = draft.files || [];

  const rows = [
    'Box Studio quote request',
    'This summary was prepared on your device. It has not been submitted.',
    '',
    line('Box', draft.customDesign ? 'Own box design' : product?.name || '—'),
    line('Category', draft.customDesign ? 'Custom structure' : product?.categoryLabel || '—'),
    line('Dimensions', dimensions),
    line('Quantity', quantity),
    line('Material', material?.name || '—'),
    line('Finishes', finishes.length ? finishes.join(', ') : 'None selected'),
    line('Insert', insert?.name || '—'),
    line('Notes', draft.notes?.trim() || '—'),
    '',
    line('Name', draft.name?.trim()),
    line('Email', draft.email?.trim()),
    line('Company', draft.company?.trim() || '—'),
    line('Phone', draft.phone?.trim() || '—'),
    '',
    'Reference files',
  ];

  if (!files.length) {
    rows.push('None attached in this session.');
  } else {
    files.forEach((file) => {
      rows.push(`- ${file.name} (${formatBytes(file.size)})`);
    });
    rows.push('');
    rows.push('These files are not included in this download. Attach them separately when you send the request.');
  }

  rows.push('');
  rows.push('Pricing, materials, samples, and timing are confirmed only after the request is reviewed.');
  return rows.join('\n');
}

export function buildInquirySummary(inquiry) {
  return [
    'Box Studio inquiry',
    'This note was prepared on your device. It has not been submitted.',
    '',
    line('Name', inquiry.name?.trim()),
    line('Email', inquiry.email?.trim()),
    line('Company', inquiry.company?.trim() || '—'),
    line('Phone', inquiry.phone?.trim() || '—'),
    '',
    'Message',
    inquiry.message?.trim() || '—',
  ].join('\n');
}
