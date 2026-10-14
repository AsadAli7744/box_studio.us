export default function Logo({ tone = 'dark', className = '' }) {
  const ink = tone === 'light' ? '#F7F4ED' : tone === 'gold' ? '#E96A1A' : '#292D2B';
  const accent = tone === 'gold' ? '#F7F4ED' : '#E96A1A';

  return (
    <svg className={`logo logo-${tone} ${className}`.trim()} viewBox="0 0 214 36" role="img" aria-label="Box Studio">
      <title>Box Studio</title>
      <g fill="none" stroke={ink} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M4 22.5 V10.5 L16 5.5 L28 10.5 V22.5 L16 27.5 Z" />
        <path d="M4 10.5 L16 15.5 L28 10.5" />
        <path d="M16 15.5 V27.5" />
        <path d="M16 5.5 V9.2" stroke={accent} strokeWidth="2" />
      </g>
      <text
        x="38"
        y="24"
        fill={ink}
        fontFamily="Segoe UI, system-ui, sans-serif"
        fontSize="20"
        fontWeight="600"
      >
        Box Studio
      </text>
    </svg>
  );
}
