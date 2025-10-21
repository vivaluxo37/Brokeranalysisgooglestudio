/**
 * Optimized Icon Loader
 *
 * Dynamically imports icons to reduce initial bundle size
 * and creates separate chunks for different icon categories.
 */

import React, { Suspense, lazy, ComponentType } from 'react'

// Icon category types
type IconCategory = 'ui' | 'navigation' | 'social' | 'business' | 'charts' | 'communication';

// Icon cache to avoid re-importing
const iconCache = new Map<string, ComponentType<any>>()

// Loading fallback component
const IconFallback: React.FC<{ size?: number | string; className?: string }> = ({ size = 20, className = '' }) => (
  <div
    style={{ width: size, height: size }}
    className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
  />
)

/**
 * Lazy load an icon from lucide-react
 */
export const loadIcon = async (iconName: string): Promise<ComponentType<any>> => {
  // Check cache first
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!
  }

  try {
    // Dynamic import based on icon name
    const iconModule = await import('lucide-react').then(module => {
      if (module[iconName as keyof typeof module]) {
        return module[iconName as keyof typeof module] as ComponentType<any>
      }
      throw new Error(`Icon ${iconName} not found`)
    })

    // Cache the icon
    iconCache.set(iconName, iconModule)
    return iconModule
  } catch (error) {
    console.warn(`Failed to load icon: ${iconName}`, error)
    // Return a default fallback icon
    return (props: any) => (
      <div {...props} className="inline-block text-center text-xs text-gray-500">
        ?
      </div>
    )
  }
}

/**
 * Icon component that lazily loads the requested icon
 */
interface LazyIconProps {
  name: string;
  size?: number | string;
  className?: string;
  category?: IconCategory;
  [key: string]: any;
}

export const LazyIcon: React.FC<LazyIconProps> = ({
  name,
  size = 20,
  className = '',
  category,
  ...props
}) => {
  const [Icon, setIcon] = React.useState<ComponentType<any> | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true

    const loadIconComponent = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check cache first
        if (iconCache.has(name)) {
          const cachedIcon = iconCache.get(name)!
          if (mounted) {
            setIcon(() => cachedIcon)
            setLoading(false)
          }
          return
        }

        // Load icon based on category or default
        let iconModule

        if (category) {
          // Try category-specific import pattern first
          try {
            iconModule = await import('lucide-react').then(module => {
              const icon = module[name as keyof typeof module]
              if (!icon) {throw new Error(`Icon ${name} not found in category ${category}`)}
              return icon as ComponentType<any>
            })
          } catch {
            // Fallback to general import
            iconModule = await loadIcon(name)
          }
        } else {
          iconModule = await loadIcon(name)
        }

        if (mounted) {
          setIcon(() => iconModule)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setLoading(false)
        }
      }
    }

    loadIconComponent()

    return () => {
      mounted = false
    }
  }, [name, category])

  if (loading) {
    return <IconFallback size={size} className={className} />
  }

  if (error || !Icon) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`inline-flex items-center justify-center text-gray-400 ${className}`}
        {...props}
      >
        <span style={{ fontSize: typeof size === 'number' ? size * 0.6 : '12px' }}>?</span>
      </div>
    )
  }

  return <Icon size={size} className={className} {...props} />
}

/**
 * Preload commonly used icons
 */
export const preloadCommonIcons = async () => {
  const commonIcons = [
    'Star', 'Heart', 'ChevronDown', 'ChevronRight', 'ChevronLeft', 'ChevronUp',
    'Search', 'Filter', 'ExternalLink', 'Check', 'X', 'Plus', 'Minus',
    'TrendingUp', 'TrendingDown', 'BarChart3', 'PieChart', 'Users',
    'Shield', 'Globe', 'Mail', 'Phone', 'Calendar', 'Clock',
  ]

  // Preload icons in parallel batches
  const batchSize = 5
  for (let i = 0; i < commonIcons.length; i += batchSize) {
    const batch = commonIcons.slice(i, i + batchSize)
    await Promise.all(batch.map(iconName => loadIcon(iconName)))
  }
}

/**
 * Icon bundle for specific categories
 */
export const createIconBundle = (icons: string[]): ComponentType<any> => {
  const IconBundle: React.FC<{ name: string; [key: string]: any }> = ({ name, ...props }) => {
    return <LazyIcon name={name} {...props} />
  }

  // Preload all icons in this bundle
  icons.forEach(iconName => loadIcon(iconName))

  return IconBundle
}

// Category-specific icon bundles
export const UIIcons = createIconBundle([
  'Check', 'X', 'Plus', 'Minus', 'AlertCircle', 'AlertTriangle',
  'Info', 'CheckCircle', 'XCircle', 'Loader2', 'ChevronDown',
])

export const NavigationIcons = createIconBundle([
  'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronDown',
  'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  'Home', 'Menu', 'X', 'Search',
])

export const BusinessIcons = createIconBundle([
  'Building', 'Briefcase', 'DollarSign', 'TrendingUp', 'TrendingDown',
  'BarChart', 'BarChart3', 'PieChart', 'Users', 'User', 'UserPlus',
  'Shield', 'Award', 'Star', 'Heart',
])

export const SocialIcons = createIconBundle([
  'Facebook', 'Twitter', 'Linkedin', 'Instagram', 'Youtube',
  'Mail', 'Phone', 'MessageCircle', 'Share2', 'ExternalLink',
])

export default LazyIcon
