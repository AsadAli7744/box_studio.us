export default function MeasurementFigure() {
  return (
    <figure className="measure-figure">
      <svg viewBox="0 0 360 200" role="img" aria-labelledby="measure-title measure-desc">
        <title id="measure-title">Internal length, width, and height</title>
        <desc id="measure-desc">
          Length runs along the front of the box, width is the depth from front to back, and height is vertical. All three are measured inside the box.
        </desc>
        <polygon points="78,78 168,42 258,78 168,114" fill="#FBF8F2" stroke="#292D2B" strokeWidth="1.4" />
        <polygon points="78,78 168,114 168,164 78,128" fill="#EBE6DC" stroke="#292D2B" strokeWidth="1.4" />
        <polygon points="168,114 258,78 258,128 168,164" fill="#F7F4ED" stroke="#292D2B" strokeWidth="1.4" />
        <line x1="86" y1="176" x2="160" y2="176" stroke="#E96A1A" strokeWidth="1.4" />
        <polyline points="86,172 86,180" fill="none" stroke="#E96A1A" />
        <polyline points="160,172 160,180" fill="none" stroke="#E96A1A" />
        <text x="96" y="194" fill="#292D2B" fontSize="13" fontFamily="Segoe UI, system-ui, sans-serif">Length</text>
        <line x1="176" y1="172" x2="250" y2="136" stroke="#E96A1A" strokeWidth="1.4" />
        <text x="214" y="168" fill="#292D2B" fontSize="13" fontFamily="Segoe UI, system-ui, sans-serif">Width</text>
        <line x1="272" y1="80" x2="272" y2="128" stroke="#E96A1A" strokeWidth="1.4" />
        <polyline points="268,80 276,80" fill="none" stroke="#E96A1A" />
        <polyline points="268,128 276,128" fill="none" stroke="#E96A1A" />
        <text x="282" y="108" fill="#292D2B" fontSize="13" fontFamily="Segoe UI, system-ui, sans-serif">Height</text>
      </svg>
      <figcaption>Internal length × width × height. Measure the space inside the walls.</figcaption>
    </figure>
  );
}
