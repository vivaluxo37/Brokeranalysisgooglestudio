/**
 * Optimized Image Component
 * Handles lazy loading, responsive images, and modern formats
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  sizes?: string;
  srcSet?: string[];
  placeholder?: 'blur' | 'empty' | 'color';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  fallback?: React.ReactNode;
}

interface ImageState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  currentSrc: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  priority = false,
  quality = 75,
  format = 'auto',
  sizes,
  srcSet,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  fallback
}) => {
  const [imageState, setImageState] = useState<ImageState>({
    isLoading: true,
    isLoaded: false,
    hasError: false,
    currentSrc: ''
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image URL
  const generateOptimizedSrc = useCallback((originalSrc: string): string => {
    if (!originalSrc) return '';

    // If it's already an optimized URL, return as-is
    if (originalSrc.includes('?format=') || originalSrc.includes('cdn') || originalSrc.includes('unsplash')) {
      return originalSrc;
    }

    // For local images, we could use an image optimization service
    // This is a placeholder for actual optimization logic
    const url = new URL(originalSrc, window.location.origin);
    
    if (format !== 'auto' && format !== 'jpg' && format !== 'png') {
      url.searchParams.set('format', format);
    }
    
    url.searchParams.set('quality', quality.toString());
    
    return url.toString();
  }, [format, quality]);

  // Generate srcset for responsive images
  const generateSrcSet = useCallback((): string => {
    if (srcSet && srcSet.length > 0) {
      return srcSet
        .map((size, index) => `${generateOptimizedSrc(src)}?w=${size} ${index + 1}x`)
        .join(', ');
    }

    // Default responsive srcset
    if (width) {
      const sizes = [width, Math.round(width * 1.5), Math.round(width * 2)];
      return sizes
        .map(w => `${generateOptimizedSrc(src)}?w=${w} ${w}w`)
        .join(', ');
    }

    return generateOptimizedSrc(src);
  }, [src, srcSet, width, generateOptimizedSrc]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      isLoaded: true,
      hasError: false
    }));
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      isLoaded: false,
      hasError: true
    }));
    onError?.(new Error(`Failed to load image: ${src}`));
  }, [src, onError]);

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || loading !== 'lazy' || priority) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const optimizedSrc = generateOptimizedSrc(src);
          setImageState(prev => ({ ...prev, currentSrc: optimizedSrc }));
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, loading, priority, generateOptimizedSrc]);

  // Set initial src for eager loading or priority images
  useEffect(() => {
    if ((loading === 'eager' || priority) && !imageState.currentSrc) {
      const optimizedSrc = generateOptimizedSrc(src);
      setImageState(prev => ({ ...prev, currentSrc: optimizedSrc }));
    }
  }, [src, loading, priority, generateOptimizedSrc, imageState.currentSrc]);

  // Generate placeholder styles
  const getPlaceholderStyles = useCallback((): React.CSSProperties => {
    switch (placeholder) {
      case 'blur':
        return blurDataURL
          ? {
              backgroundImage: `url(${blurDataURL})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(20px)',
              transform: 'scale(1.1)'
            }
          : {
              backgroundColor: '#f3f4f6'
            };
      
      case 'color':
        return {
          backgroundColor: '#e5e7eb'
        };
      
      case 'empty':
      default:
        return {
          backgroundColor: 'transparent'
        };
    }
  }, [placeholder, blurDataURL]);

  // If there's an error and fallback is provided
  if (imageState.hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        imageState.isLoading && 'animate-pulse',
        className
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      {/* Placeholder */}
      {imageState.isLoading && placeholder !== 'empty' && (
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={getPlaceholderStyles()}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={imageState.currentSrc || (loading === 'eager' || priority ? generateOptimizedSrc(src) : undefined)}
        srcSet={imageState.currentSrc ? generateSrcSet() : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          imageState.isLoaded ? 'opacity-100' : 'opacity-0',
          imageState.hasError && 'hidden'
        )}
        style={{
          color: 'transparent' // Prevents FOUC
        }}
      />

      {/* Error state */}
      {imageState.hasError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center p-4">
            <svg
              className="w-8 h-8 mx-auto mb-2 text-gray-400"
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
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Loading spinner */}
      {imageState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
        </div>
      )}
    </div>
  );
};

// Picture component for art direction
export const Picture: React.FC<
  Omit<OptimizedImageProps, 'format'> & {
    sources: Array<{
      media?: string;
      srcSet: string;
      type?: string;
      format?: string;
    }>;
  }
> = ({ sources, ...imgProps }) => {
  return (
    <picture>
      {sources.map((source, index) => (
        <source
          key={index}
          media={source.media}
          srcSet={source.srcSet}
          type={source.type}
        />
      ))}
      <OptimizedImage {...imgProps} />
    </picture>
  );
};

// Hook for preloading images
export function useImagePreloader() {
  const preload = useCallback((src: string, priority: 'high' | 'low' = 'low') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    if (priority === 'high') {
      link.fetchPriority = 'high';
    }
    
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return { preload };
}

// Hook for progressive image loading
export function useProgressiveImage(src: string, placeholderSrc?: string) {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || src);
  const [isLoading, setIsLoading] = useState(!placeholderSrc);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setIsLoading(false);
    };
  }, [src]);

  return { imageSrc, isLoading };
}

export default OptimizedImage;
