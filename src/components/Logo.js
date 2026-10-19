export default function Logo({ className = '', light = false }) {
  const word = light ? '#F7F4ED' : '#044C40';
  const accent = light ? '#FFFFFF' : '#E18238';

  return (
    <svg className={`logo ${className}`.trim()} viewBox="0 0 560 148" role="img" aria-label="Boxstudio.us">
      <title>Boxstudio.us</title>
      <text x="0" y="78" fontFamily="Segoe UI, system-ui, sans-serif" fontSize="74" fontWeight="700">
        <tspan fill={word}>Boxstudio</tspan>
        <tspan fill={accent}>.us</tspan>
      </text>
      <text
        x="268"
        y="124"
        textAnchor="middle"
        fill={word}
        fontFamily="Segoe UI, system-ui, sans-serif"
        fontSize="16.5"
        fontWeight="600"
        letterSpacing="6.6"
      >
        CUSTOM BOXES & PACKAGING
      </text>
    </svg>
  );
}
