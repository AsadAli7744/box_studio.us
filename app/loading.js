export default function Loading() {
  return (
    <div className="site-loader is-active route-loading" aria-busy="true" role="status">
      <div className="site-loader-panel">
        <div className="loader" aria-hidden="true" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
