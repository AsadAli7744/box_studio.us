export default function Logo({ className = '' }) {
  return (
    <svg
      className={`logo ${className}`.trim()}
      viewBox="0 82 1024 176"
      role="img"
      aria-label="Box Studio, next generation packaging"
    >
      <image
        href="/images/Sleek Box Studio Packaging Logo.webp"
        x="0"
        y="0"
        width="1024"
        height="341"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
