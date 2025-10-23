/**
 * UI Components Index
 * Centralized exports for all UI components
 */

// Core UI components with proper casing
export { Button } from './Button'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './Card'
export { Input } from './Input'
export { Badge } from './Badge'
export { Progress } from './Progress'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
export { Checkbox } from './checkbox'
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

// Legacy components for backward compatibility
export { Button as ButtonLegacy } from './Button-legacy'
export { Card as CardLegacy } from './Card-legacy'
export { Input as InputLegacy } from './Input-legacy'
export { Badge as BadgeLegacy } from './Badge-legacy'

// Additional UI components
export * from './OptimizedImage'
export * from './QuickAccessWidget'
export * from './markdown'
export * from './LoadingSpinner'
export * from './SkeletonLoaders'
export * from './StarRating'
export * from './Tooltip'
export * from './ThemeToggle'
export * from './ErrorBoundary'

// Re-export everything for comprehensive access
export * from './Button'
export * from './Card'
export * from './Input'
export * from './Badge'
export * from './Progress'
export * from './tabs'
export * from './checkbox'
export * from './select'
