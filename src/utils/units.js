export const UNITS = [
  { id: 'mm', label: 'Millimetres' },
  { id: 'cm', label: 'Centimetres' },
  { id: 'in', label: 'Inches' },
];

const TO_MM = {
  mm: 1,
  cm: 10,
  in: 25.4,
};

export function roundForUnit(value, unit) {
  const digits = unit === 'mm' ? 1 : 2;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function toMillimetres(value, unit) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n * (TO_MM[unit] || 1);
}

export function convertValue(value, fromUnit, toUnit) {
  if (value === '' || value === null || value === undefined) return '';
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  if (fromUnit === toUnit) return roundForUnit(n, toUnit);
  const millimetres = n * (TO_MM[fromUnit] || 1);
  return roundForUnit(millimetres / (TO_MM[toUnit] || 1), toUnit);
}

export function formatDimension(value, unit) {
  if (value === '' || value === null || value === undefined) return '';
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  return `${roundForUnit(n, unit)} ${unit}`;
}
