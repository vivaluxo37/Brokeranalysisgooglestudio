/**
 * Font Optimization Component
 *
 * Handles preconnect, preload, and font-display settings
 * for optimal font loading performance.
 */

import React, { useEffect } from 'react'

interface FontOptimizationProps {
  fonts?: FontConfig[];
  preconnectOrigins?: string[];
  preloadCriticalFonts?: boolean;
}

interface FontConfig {
  family: string;
  src: string;
  weight?: string | number;
  style?: 'normal' | 'italic';
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
  critical?: boolean;
}

const FontOptimization: React.FC<FontOptimizationProps> = ({
  fonts = [],
  preconnectOrigins = [],
  preloadCriticalFonts = true,
}) => {
  useEffect(() => {
    // Add preconnect links for font origins
    preconnectOrigins.forEach(origin => {
      addPreconnect(origin)
    })

    // Preload critical fonts
    if (preloadCriticalFonts) {
      fonts
        .filter(font => font.critical || font.preload)
        .forEach(font => {
          preloadFont(font)
        })
    }

    // Add font face rules
    addFontFaces(fonts)

    // Cleanup function
    return () => {
      // Remove dynamically added links if needed
      // (Usually not necessary as they're harmless once loaded)
    }
  }, [fonts, preconnectOrigins, preloadCriticalFonts])

  // Add preconnect link
  const addPreconnect = (origin: string) => {
    if (typeof document === 'undefined') {return}

    // Check if preconnect already exists
    const existing = document.querySelector(`link[rel="preconnect"][href="${origin}"]`)
    if (existing) {return}

    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin
    link.crossOrigin = 'anonymous'

    document.head.appendChild(link)
  }

  // Preload font
  const preloadFont = (font: FontConfig) => {
    if (typeof document === 'undefined') {return}

    // Check if preload already exists
    const existing = document.querySelector(`link[rel="preload"][href="${font.src}"]`)
    if (existing) {return}

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2' // Assume woff2 for modern browsers
    link.href = font.src
    link.crossOrigin = 'anonymous'

    document.head.appendChild(link)
  }

  // Add font face rules
  const addFontFaces = (fonts: FontConfig[]) => {
    if (typeof document === 'undefined') {return}

    // Check if style already exists
    const existingStyle = document.getElementById('optimized-font-styles')
    if (existingStyle) {return}

    const style = document.createElement('style')
    style.id = 'optimized-font-styles'

    const fontFaceRules = fonts.map(font => `
      @font-face {
        font-family: '${font.family}';
        src: url('${font.src}') format('woff2');
        font-weight: ${font.weight || 'normal'};
        font-style: ${font.style || 'normal'};
        font-display: ${font.display || 'swap'};
      }
    `).join('\n')

    style.textContent = fontFaceRules
    document.head.appendChild(style)
  }

  return null // This component doesn't render anything
}

/**
 * Default font configurations for common web fonts
 */
export const defaultFonts: FontConfig[] = [
  {
    family: 'Inter',
    src: '/fonts/inter-var.woff2',
    weight: '100 900',
    style: 'normal',
    display: 'swap',
    critical: true,
  },
  {
    family: 'Inter',
    src: '/fonts/inter-italic-var.woff2',
    weight: '100 900',
    style: 'italic',
    display: 'swap',
  },
  {
    family: 'JetBrains Mono',
    src: '/fonts/jetbrains-mono-var.woff2',
    weight: '100 800',
    style: 'normal',
    display: 'swap',
  },
]

/**
 * Preconnect origins for common font providers
 */
export const fontOrigins = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://use.typekit.net',
  'https://use.fontawesome.com',
]

/**
 * Hook for dynamic font loading
 */
export const useFontLoader = (fonts: FontConfig[]) => {
  useEffect(() => {
    fonts.forEach(font => {
      if (font.preload || font.critical) {
        // Inline preload function for hook
        if (typeof document !== 'undefined') {
          const existing = document.querySelector(`link[rel="preload"][href="${font.src}"]`)
          if (!existing) {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'font'
            link.type = 'font/woff2'
            link.href = font.src
            link.crossOrigin = 'anonymous'
            document.head.appendChild(link)
          }
        }
      }
    })

    // Inline addFontFaces function for hook
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('hook-font-styles')
      if (!existingStyle) {
        const style = document.createElement('style')
        style.id = 'hook-font-styles'

        const fontFaceRules = fonts.map(font => `
          @font-face {
            font-family: '${font.family}';
            src: url('${font.src}') format('woff2');
            font-weight: ${font.weight || 'normal'};
            font-style: ${font.style || 'normal'};
            font-display: ${font.display || 'swap'};
          }
        `).join('\n')

        style.textContent = fontFaceRules
        document.head.appendChild(style)
      }
    }
  }, [fonts])
}

/**
 * Font loading observer for better UX
 */
export const useFontLoadingObserver = () => {
  useEffect(() => {
    if (typeof document === 'undefined') {return}

    // Add font loading states to document
    document.documentElement.classList.add('fonts-loading')

    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.remove('fonts-loading')
        document.documentElement.classList.add('fonts-loaded')
      })
    }

    // Fallback timeout
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('fonts-loading')
      document.documentElement.classList.add('fonts-fallback')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [])
}

/**
 * Critical CSS for font loading
 */
export const fontLoadingCSS = `
  /* Font loading states */
  .fonts-loading {
    /* Show system fonts while custom fonts load */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }

  .fonts-loaded {
    /* Use custom fonts once loaded */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }

  .fonts-fallback {
    /* Fallback if fonts take too long */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  }

  /* Prevent flash of invisible text */
  .font-display-swap {
    font-display: swap;
  }

  /* Critical font inlining */
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Inter Regular'), local('Inter-Regular'),
         url('/fonts/inter-regular.woff2') format('woff2');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local('Inter SemiBold'), local('Inter-SemiBold'),
         url('/fonts/inter-semibold.woff2') format('woff2');
  }
`

/**
 * Component to inject font loading CSS
 */
export const FontLoadingStyles: React.FC = () => {
  useEffect(() => {
    if (typeof document === 'undefined') {return}

    const style = document.createElement('style')
    style.id = 'font-loading-styles'
    style.textContent = fontLoadingCSS

    document.head.appendChild(style)

    return () => {
      const existing = document.getElementById('font-loading-styles')
      if (existing) {
        document.head.removeChild(existing)
      }
    }
  }, [])

  return null
}

/**
 * Combined font optimization component
 */
export const FontOptimizer: React.FC<{
  fonts?: FontConfig[];
  origins?: string[];
  includeStyles?: boolean;
}> = ({
  fonts = defaultFonts,
  origins = fontOrigins,
  includeStyles = true,
}) => {
  useFontLoadingObserver()

  return (
    <>
      {includeStyles && <FontLoadingStyles />}
      <FontOptimization
        fonts={fonts}
        preconnectOrigins={origins}
        preloadCriticalFonts={true}
      />
    </>
  )
}

export default FontOptimization
