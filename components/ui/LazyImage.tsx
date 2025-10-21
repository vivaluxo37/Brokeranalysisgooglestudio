import React, { useState, useEffect, useRef } from 'react'

interface LazyImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

/**
 * LazyImage component with intersection observer and fallback support
 * Optimizes image loading performance by only loading images when they're near the viewport
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = '/images/broker-placeholder.png',
  className = '',
  width,
  height,
  onLoad,
  onError,
  loading = 'lazy',
  priority = false,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(priority ? src : null)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(!priority)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // If priority is set, load immediately
    if (priority) {
      setImageSrc(src)
      setIsLoading(false)
      return
    }

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src)
            setIsLoading(false)
            if (imageRef.current) {
              observer.unobserve(imageRef.current)
            }
          }
        })
      },
      {
        // Start loading when image is 50px away from viewport
        rootMargin: '50px',
        threshold: 0.01,
      },
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current)
      }
    }
  }, [src, priority])

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  // Show placeholder while loading
  if (isLoading && !imageSrc) {
    return (
      <div
        ref={imageRef}
        className={`bg-gray-100 animate-pulse ${className}`}
        style={{ width, height }}
        aria-label={alt}
      />
    )
  }

  return (
    <img
      ref={imageRef}
      src={imageError ? fallback : (imageSrc || fallback)}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      onLoad={handleLoad}
      loading={loading}
      decoding={priority ? 'sync' : 'async'}
    />
  )
}

/**
 * Optimized broker logo component using LazyImage
 */
export const BrokerLogo: React.FC<{
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
}> = ({ src, name, size = 'md', className = '', priority = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const sizeStyles = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  }

  if (!src) {
    // Show initial letter if no logo
    return (
      <div className={`${sizeClasses[size]} bg-blue-600 rounded-lg flex items-center justify-center ${className}`}>
        <span className={`text-white font-bold ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'}`}>
          {name.charAt(0)}
        </span>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} bg-gray-50 rounded-lg p-1 flex items-center justify-center ${className}`}>
      <LazyImage
        src={src}
        alt={`${name} logo`}
        className="max-w-full max-h-full object-contain"
        width={sizeStyles[size].width}
        height={sizeStyles[size].height}
        fallback="/images/broker-placeholder.png"
        priority={priority}
      />
    </div>
  )
}

export default LazyImage
