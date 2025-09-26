import React, { useState, useRef, useEffect } from 'react';
import { imageOptimizer } from '../../utils/performance';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes = '100vw',
  onLoad,
  onError,
  placeholder
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive image srcset
  const srcset = imageOptimizer.generateSrcset(src, [width || 320, 640, 1024, 1920].filter(w => w >= (width || 320)));

  // Generate optimized URLs for different formats
  const webpSrc = imageOptimizer.getOptimizedUrl(src, { width, format: 'webp' });

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    // If image is already loaded
    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src, onLoad, onError]);

  // Generate style for aspect ratio
  const aspectRatioStyle = width && height ? {
    aspectRatio: `${width} / ${height}`,
    maxWidth: '100%',
    height: 'auto'
  } : {};

  return (
    <div className={`relative overflow-hidden ${className}`} style={aspectRatioStyle}>
      {/* Placeholder or low-quality image placeholder */}
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          style={{ filter: 'blur(10px)' }}
          aria-hidden="true"
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !hasError && !placeholder && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}

      {/* WebP source for browsers that support it */}
      <picture>
        <source
          srcSet={imageOptimizer.generateSrcset(src, [width || 320, 640, 1024, 1920].filter(w => w >= (width || 320)))
            .split(', ')
            .map(item => {
              const [url, descriptor] = item.trim().split(' ');
              return imageOptimizer.getOptimizedUrl(url, { width: parseInt(descriptor), format: 'webp' }) + ' ' + descriptor;
            })
            .join(', ')}
          type="image/webp"
        />
        <img
          ref={imgRef}
          src={imageOptimizer.getOptimizedUrl(src, { width })}
          srcSet={srcset}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          fetchPriority={fetchPriority}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundColor: hasError ? '#f3f4f6' : 'transparent',
          }}
        />
      </picture>

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;