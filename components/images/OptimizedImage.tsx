/**
 * Optimized Image Component
 *
 * Handles responsive images, WebP/AVIF formats, lazy loading,
 * and proper fallbacks for better performance.
 */

import React, { useState, useRef, useEffect, ImgHTMLAttributes } from 'react'

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean; // Skip lazy loading for above-the-fold images
  formats?: ('webp' | 'avif' | 'original')[];
  sizes?: string; // Responsive sizes attribute
  quality?: number; // 1-100
  placeholder?: 'blur' | 'empty' | 'color';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  formats = ['webp', 'avif', 'original'],
  sizes,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string>('')
  const imgRef = useRef<HTMLImageElement>(null)

  // Generate responsive srcset
  const generateSrcSet = (baseSrc: string, format?: string): string => {
    const widths = [320, 640, 768, 1024, 1280, 1536]
    const baseUrl = baseSrc.split('.')[0]
    const extension = baseSrc.split('.').pop()

    return widths
      .map(w => {
        const formattedSrc = format && format !== 'original'
          ? `${baseUrl}_${w}w.${format}`
          : `${baseUrl}_${w}w.${extension}`
        return `${formattedSrc} ${w}w`
      })
      .join(', ')
  }

  // Generate picture sources
  const generateSources = () => {
    const sources: React.ReactElement[] = []

    // Add AVIF source if supported and requested
    if (formats.includes('avif') && supportsFormat('avif')) {
      sources.push(
        <source
          key="avif"
          type="image/avif"
          srcSet={generateSrcSet(src, 'avif')}
          sizes={sizes}
        />,
      )
    }

    // Add WebP source if supported and requested
    if (formats.includes('webp') && supportsFormat('webp')) {
      sources.push(
        <source
          key="webp"
          type="image/webp"
          srcSet={generateSrcSet(src, 'webp')}
          sizes={sizes}
        />,
      )
    }

    return sources
  }

  // Check format support
  const supportsFormat = (format: string): boolean => {
    if (typeof window === 'undefined') {return false}

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {return false}

    switch (format) {
      case 'webp':
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
      case 'avif':
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
      default:
        return true
    }
  }

  // Setup intersection observer for lazy loading
  useEffect(() => {
    if (!imgRef.current || priority) {return}

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setCurrentSrc(src)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      },
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [src, priority])

  // Load image immediately if priority
  useEffect(() => {
    if (priority) {
      setCurrentSrc(src)
    }
  }, [src, priority])

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  // Handle image error
  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Generate placeholder style
  const getPlaceholderStyle = (): React.CSSProperties => {
    if (!isLoaded && placeholder === 'blur' && blurDataURL) {
      return {
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(8px)',
        transform: 'scale(1.1)',
      }
    }

    if (!isLoaded && placeholder === 'color') {
      return {
        backgroundColor: '#f3f4f6',
      }
    }

    return {}
  }

  // Error state
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-xs">Failed to load</span>
      </div>
    )
  }

  // Loading state with placeholder
  if (!currentSrc && !priority) {
    return (
      <div
        className={`bg-gray-200 ${className}`}
        style={{
          width,
          height,
          ...getPlaceholderStyle(),
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <picture className={className}>
      {generateSources()}
      <img
        ref={imgRef}
        src={currentSrc || src}
        srcSet={currentSrc ? generateSrcSet(currentSrc) : undefined}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          ...getPlaceholderStyle(),
        }}
        {...props}
      />
    </picture>
  )
}

/**
 * Preload critical images
 */
export const preloadImage = (src: string, format?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = format && format !== 'original'
      ? src.replace(/\.[^/.]+$/, `_${format}.${format}`)
      : src

    if (format && format !== 'original') {
      link.type = format === 'webp' ? 'image/webp' : 'image/avif'
    }

    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to preload image: ${src}`))

    document.head.appendChild(link)

    // Clean up after loading
    setTimeout(() => {
      document.head.removeChild(link)
    }, 1000)
  })
}

/**
 * Responsive image preset for common use cases
 */
export const ResponsiveImage: React.FC<{
  src: string;
  alt: string;
  variant?: 'hero' | 'card' | 'thumbnail' | 'avatar';
  priority?: boolean;
  className?: string;
}> = ({ src, alt, variant = 'card', priority = false, className = '' }) => {
  const variants = {
    hero: {
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      className: 'w-full h-auto',
      placeholder: 'blur' as const,
    },
    card: {
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      className: 'w-full h-48 object-cover',
      placeholder: 'empty' as const,
    },
    thumbnail: {
      sizes: '80px',
      className: 'w-20 h-20 object-cover rounded-lg',
      placeholder: 'empty' as const,
    },
    avatar: {
      sizes: '40px',
      className: 'w-10 h-10 object-cover rounded-full',
      placeholder: 'color' as const,
    },
  }

  const config = variants[variant]

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      sizes={config.sizes}
      className={`${config.className} ${className}`}
      placeholder={config.placeholder}
      priority={priority}
    />
  )
}

export default OptimizedImage
