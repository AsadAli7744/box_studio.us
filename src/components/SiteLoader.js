'use client';

export default function SiteLoader({ active = false }) {
  return (
    <div className={`site-loader${active ? ' is-active' : ''}`} aria-hidden={!active} role="status">
      <div className="site-loader-panel">
        <div className="loader" aria-hidden="true" />
      </div>
      <span className="sr-only">{active ? 'Loading' : ''}</span>
    </div>
  );
}
