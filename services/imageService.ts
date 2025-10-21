/**
 * Image Service
 * Handles image optimization, compression, and format conversion
 */

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  sharpen?: boolean;
  blur?: number;
  grayscale?: boolean;
  rotate?: number;
}

export interface ImageInfo {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  aspectRatio: number;
}

export interface OptimizedImageResult {
  url: string;
  info: ImageInfo;
  options: ImageOptions;
  savings: {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
  };
}

class ImageService {
  private readonly supportedFormats = ['webp', 'avif', 'jpg', 'jpeg', 'png', 'gif', 'svg']
  private readonly defaultQuality = 75
  private readonly optimizationCache = new Map<string, OptimizedImageResult>()

  /**
   * Check if browser supports a specific image format
   */
  supportsFormat(format: string): boolean {
    if (typeof document === 'undefined') {return false}

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1

    return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0
  }

  /**
   * Get the best supported format for the browser
   */
  getBestSupportedFormat(): 'avif' | 'webp' | 'jpg' {
    if (this.supportsFormat('avif')) {return 'avif'}
    if (this.supportsFormat('webp')) {return 'webp'}
    return 'jpg'
  }

  /**
   * Generate optimized image URL
   */
  generateOptimizedUrl(
    originalUrl: string,
    options: ImageOptions = {},
  ): string {
    const {
      width,
      height,
      quality = this.defaultQuality,
      format = this.getBestSupportedFormat(),
      crop,
      fit = 'cover',
      sharpen = false,
      blur = 0,
      grayscale = false,
      rotate = 0,
    } = options

    // If it's already an optimized URL or external CDN, return as-is
    if (this.isExternalImage(originalUrl)) {
      return originalUrl
    }

    // Generate cache key
    const cacheKey = this.generateCacheKey(originalUrl, options)

    // Check cache
    if (this.optimizationCache.has(cacheKey)) {
      return this.optimizationCache.get(cacheKey)!.url
    }

    // Build optimized URL
    const url = new URL(originalUrl, window.location.origin)
    const params = new URLSearchParams()

    // Add optimization parameters
    if (width) {params.set('w', width.toString())}
    if (height) {params.set('h', height.toString())}
    if (quality !== this.defaultQuality) {params.set('q', quality.toString())}
    if (format !== 'jpg') {params.set('f', format)}
    if (fit !== 'cover') {params.set('fit', fit)}

    if (crop) {
      params.set('crop', `${crop.x},${crop.y},${crop.width},${crop.height}`)
    }

    if (sharpen) {params.set('sharp', 'true')}
    if (blur > 0) {params.set('blur', blur.toString())}
    if (grayscale) {params.set('gray', 'true')}
    if (rotate !== 0) {params.set('rot', rotate.toString())}

    // Update URL with parameters
    url.search = params.toString()

    return url.toString()
  }

  /**
   * Generate responsive srcset
   */
  generateSrcSet(
    originalUrl: string,
    sizes: number[],
    options: Omit<ImageOptions, 'width'> = {},
  ): string {
    return sizes
      .map(size => {
        const optimizedUrl = this.generateOptimizedUrl(originalUrl, {
          ...options,
          width: size,
        })
        return `${optimizedUrl} ${size}w`
      })
      .join(', ')
  }

  /**
   * Get image information
   */
  async getImageInfo(url: string): Promise<ImageInfo> {
    return new Promise((resolve, reject) => {
      const img = new Image()

      img.onload = () => {
        resolve({
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: 0, // Would need to fetch to get size
          format: this.getImageFormatFromUrl(url),
          aspectRatio: img.naturalWidth / img.naturalHeight,
        })
      }

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`))
      }

      img.src = url
    })
  }

  /**
   * Optimize image and return result
   */
  async optimizeImage(
    originalUrl: string,
    options: ImageOptions = {},
  ): Promise<OptimizedImageResult> {
    const optimizedUrl = this.generateOptimizedUrl(originalUrl, options)

    try {
      const info = await this.getImageInfo(originalUrl)

      // Estimate file size savings (rough estimation)
      const originalSize = this.estimateFileSize(info.width, info.height, info.format)
      const optimizedSize = this.estimateFileSize(
        options.width || info.width,
        options.height || info.height,
        options.format || this.getBestSupportedFormat(),
        options.quality,
      )

      const result: OptimizedImageResult = {
        url: optimizedUrl,
        info,
        options,
        savings: {
          originalSize,
          optimizedSize,
          compressionRatio: 1 - (optimizedSize / originalSize),
        },
      }

      // Cache the result
      const cacheKey = this.generateCacheKey(originalUrl, options)
      this.optimizationCache.set(cacheKey, result)

      return result
    } catch (error) {
      throw new Error(`Failed to optimize image: ${error}`)
    }
  }

  /**
   * Generate placeholder image (blur, low quality)
   */
  generatePlaceholderUrl(
    originalUrl: string,
    width: number = 20,
    height: number = 20,
  ): string {
    return this.generateOptimizedUrl(originalUrl, {
      width,
      height,
      quality: 10,
      format: 'jpg',
      blur: 10,
    })
  }

  /**
   * Create responsive image sizes attribute
   */
  generateSizesAttribute(breakpoints: Array<{ maxWidth: number; size: string }>): string {
    return breakpoints
      .map(bp => `(max-width: ${bp.maxWidth}px) ${bp.size}`)
      .join(', ')
  }

  /**
   * Preload critical images
   */
  preloadImages(urls: string[], priority: 'high' | 'low' = 'low'): void {
    urls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url

      if (priority === 'high') {
        link.fetchPriority = 'high'
      }

      document.head.appendChild(link)
    })
  }

  /**
   * Check if image is external (CDN, external service)
   */
  private isExternalImage(url: string): boolean {
    const externalDomains = [
      'unsplash.com',
      'images.unsplash.com',
      'picsum.photos',
      'placeholder.com',
      'loremflickr.com',
      'cloudinary.com',
      'imgix.com',
      'imagekit.io',
    ]

    try {
      const urlObj = new URL(url)
      return externalDomains.some(domain =>
        urlObj.hostname.includes(domain),
      )
    } catch {
      return false
    }
  }

  /**
   * Generate cache key for optimization
   */
  private generateCacheKey(originalUrl: string, options: ImageOptions): string {
    const optionsStr = JSON.stringify(options, Object.keys(options).sort())
    return `${originalUrl}:${btoa(optionsStr)}`
  }

  /**
   * Get image format from URL
   */
  private getImageFormatFromUrl(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase() || 'jpg'
    return extension === 'jpeg' ? 'jpg' : extension
  }

  /**
   * Estimate file size (rough estimation)
   */
  private estimateFileSize(
    width: number,
    height: number,
    format: string,
    quality: number = 75,
  ): number {
    const pixels = width * height

    // Base bytes per pixel by format
    const bytesPerPixel: Record<string, number> = {
      jpg: 0.15,
      jpeg: 0.15,
      png: 0.5,
      webp: 0.1,
      avif: 0.08,
      gif: 0.3,
      svg: 0.01,
    }

    const baseBytesPerPixel = bytesPerPixel[format] || 0.15
    const qualityFactor = quality / 100

    return Math.round(pixels * baseBytesPerPixel * qualityFactor)
  }

  /**
   * Clear optimization cache
   */
  clearCache(): void {
    this.optimizationCache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    entries: Array<{
      key: string;
      url: string;
      savings: number;
    }>;
    } {
    const entries = Array.from(this.optimizationCache.entries()).map(([key, result]) => ({
      key,
      url: result.url,
      savings: result.savings.compressionRatio,
    }))

    return {
      size: this.optimizationCache.size,
      entries,
    }
  }
}

// Create singleton instance
const imageService = new ImageService()

export default imageService
