import React from 'react';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

// Simple lazy image component
export const OptimizedLazyImage: React.FC<OptimizedLazyImageProps> = ({ 
  src, 
  alt, 
  className = '',
  width,
  height 
}) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      width={width}
      height={height}
      loading="lazy"
    />
  );
};