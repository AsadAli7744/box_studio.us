import Image from 'next/image';

export default function CatalogImage({
  src,
  alt,
  className,
  sizes = '(max-width: 700px) 100vw, 40vw',
  priority = false,
  width = 800,
  height = 800,
}) {
  if (!src) return null;
  return (
    <Image
      className={className}
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
    />
  );
}
