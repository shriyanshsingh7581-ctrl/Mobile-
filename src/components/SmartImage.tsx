import React, { useState } from 'react';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { generateProductStudioSvg } from '../utils/productVisuals';

interface SmartImageProps {
  src: string;
  alt: string;
  brand?: string;
  category?: string;
  primaryHex?: string;
  className?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  brand = 'Charlie Mobile',
  category = 'smartphones',
  primaryHex = '#1E293B',
  className = 'w-full h-full object-contain',
}) => {
  const [hasError, setHasError] = useState(false);

  const fallbackSvg = generateProductStudioSvg({
    title: alt,
    brand,
    category,
    primaryHex,
  });

  const resolvedSrc = !src || hasError ? fallbackSvg : optimizeCloudinaryUrl(src);

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
