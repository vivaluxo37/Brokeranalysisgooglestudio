/**
 * Bundle Analyzer Script
 * Analyzes bundle size, dependencies, and provides optimization recommendations
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  dependencies: DependencyInfo[];
  assets: AssetInfo[];
  recommendations: Recommendation[];
  warnings: Warning[];
}

interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize: number;
  modules: ModuleInfo[];
  imports: string[];
  dynamicImports: string[];
}

interface ModuleInfo {
  id: string;
  name: string;
  size: number;
  path: string;
}

interface DependencyInfo {
  name: string;
  version: string;
  size: number;
  gzippedSize: number;
  used: boolean;
  type: 'dependency' | 'devDependency' | 'peerDependency';
}

interface AssetInfo {
  name: string;
  size: number;
  gzippedSize: number;
  type: 'image' | 'font' | 'css' | 'js' | 'other';
  optimized: boolean;
}

interface Recommendation {
  type: 'optimization' | 'warning' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'complex';
  code?: string;
}

interface Warning {
  type: 'size' | 'dependency' | 'performance' | 'security';
  message: string;
  severity: 'error' | 'warning' | 'info';
}

class BundleAnalyzer {
  private readonly projectRoot: string
  private readonly buildDir: string

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
    this.buildDir = join(projectRoot, 'dist/client')
  }

  /**
   * Run complete bundle analysis
   */
  async analyze(): Promise<BundleAnalysis> {
    console.log('🔍 Analyzing bundle...\n')

    // Check if build exists
    if (!existsSync(this.buildDir)) {
      throw new Error('Build directory not found. Run `npm run build` first.')
    }

    const analysis: BundleAnalysis = {
      totalSize: 0,
      gzippedSize: 0,
      chunks: [],
      dependencies: [],
      assets: [],
      recommendations: [],
      warnings: [],
    }

    // Analyze manifest file
    const manifest = this.loadManifest()
    if (manifest) {
      analysis.chunks = this.analyzeChunks(manifest)
      analysis.totalSize = analysis.chunks.reduce((sum, chunk) => sum + chunk.size, 0)
      analysis.gzippedSize = analysis.chunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0)
    }

    // Analyze dependencies
    analysis.dependencies = this.analyzeDependencies()

    // Analyze assets
    analysis.assets = this.analyzeAssets()

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis)

    // Generate warnings
    analysis.warnings = this.generateWarnings(analysis)

    return analysis
  }

  /**
   * Load and parse manifest file
   */
  private loadManifest(): any {
    const manifestPath = join(this.buildDir, '.vite', 'manifest.json')

    if (!existsSync(manifestPath)) {
      console.warn('Manifest file not found. Some analysis features may be limited.')
      return null
    }

    try {
      const manifestContent = readFileSync(manifestPath, 'utf8')
      return JSON.parse(manifestContent)
    } catch (error) {
      console.error('Failed to parse manifest file:', error)
      return null
    }
  }

  /**
   * Analyze bundle chunks
   */
  private analyzeChunks(manifest: any): ChunkInfo[] {
    const chunks: ChunkInfo[] = []

    for (const [key, entry] of Object.entries(manifest)) {
      if (typeof entry === 'object' && entry !== null) {
        const chunkInfo = entry as any

        // Try to get file sizes
        const filePath = join(this.buildDir, chunkInfo.file)
        const size = this.getFileSize(filePath)
        const gzippedSize = this.getGzippedSize(filePath)

        chunks.push({
          name: key,
          size,
          gzippedSize,
          modules: chunkInfo.modules || [],
          imports: chunkInfo.imports || [],
          dynamicImports: chunkInfo.dynamicImports || [],
        })
      }
    }

    return chunks.sort((a, b) => b.size - a.size)
  }

  /**
   * Analyze dependencies from package.json
   */
  private analyzeDependencies(): DependencyInfo[] {
    const packageJsonPath = join(this.projectRoot, 'package.json')

    if (!existsSync(packageJsonPath)) {
      return []
    }

    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
      const dependencies: DependencyInfo[] = []

      // Analyze production dependencies
      if (packageJson.dependencies) {
        for (const [name, version] of Object.entries(packageJson.dependencies)) {
          dependencies.push({
            name,
            version: String(version),
            size: this.estimateDependencySize(name),
            gzippedSize: this.estimateDependencySize(name, true),
            used: this.isDependencyUsed(name),
            type: 'dependency',
          })
        }
      }

      return dependencies.sort((a, b) => b.size - a.size)
    } catch (error) {
      console.error('Failed to analyze dependencies:', error)
      return []
    }
  }

  /**
   * Analyze static assets
   */
  private analyzeAssets(): AssetInfo[] {
    const assets: AssetInfo[] = []
    const assetsDir = join(this.buildDir, 'assets')

    if (!existsSync(assetsDir)) {
      return assets
    }

    try {
      const assetFiles = this.getAllFiles(assetsDir)

      for (const filePath of assetFiles) {
        const size = this.getFileSize(filePath)
        const gzippedSize = this.getGzippedSize(filePath)
        const ext = filePath.split('.').pop()?.toLowerCase()

        let type: AssetInfo['type'] = 'other'
        if (ext && ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'].includes(ext)) {
          type = 'image'
        } else if (ext && ['woff', 'woff2', 'ttf', 'eot'].includes(ext)) {
          type = 'font'
        } else if (ext === 'css') {
          type = 'css'
        } else if (ext && ['js', 'mjs'].includes(ext)) {
          type = 'js'
        }

        const name = filePath.replace(assetsDir, '').replace(/^\//, '')

        assets.push({
          name,
          size,
          gzippedSize,
          type,
          optimized: this.isAssetOptimized(filePath, type),
        })
      }

      return assets.sort((a, b) => b.size - a.size)
    } catch (error) {
      console.error('Failed to analyze assets:', error)
      return []
    }
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(analysis: BundleAnalysis): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Bundle size recommendations
    if (analysis.totalSize > 1024 * 1024) { // > 1MB
      recommendations.push({
        type: 'optimization',
        title: 'Reduce Bundle Size',
        description: 'Your bundle is over 1MB. Consider code splitting and removing unused dependencies.',
        impact: 'high',
        effort: 'moderate',
      })
    }

    // Chunk analysis
    const largeChunks = analysis.chunks.filter(chunk => chunk.size > 300 * 1024)
    if (largeChunks.length > 0) {
      recommendations.push({
        type: 'optimization',
        title: 'Split Large Chunks',
        description: `Found ${largeChunks.length} chunks over 300KB. Consider dynamic imports for better loading performance.`,
        impact: 'high',
        effort: 'easy',
      })
    }

    // Unused dependencies
    const unusedDeps = analysis.dependencies.filter(dep => !dep.used)
    if (unusedDeps.length > 0) {
      recommendations.push({
        type: 'optimization',
        title: 'Remove Unused Dependencies',
        description: `Found ${unusedDeps.length} unused dependencies. Remove them to reduce bundle size.`,
        impact: 'medium',
        effort: 'easy',
      })
    }

    // Image optimization
    const unoptimizedImages = analysis.assets.filter(
      asset => asset.type === 'image' && !asset.optimized,
    )
    if (unoptimizedImages.length > 0) {
      recommendations.push({
        type: 'optimization',
        title: 'Optimize Images',
        description: `Found ${unoptimizedImages.length} unoptimized images. Use modern formats and compression.`,
        impact: 'medium',
        effort: 'easy',
      })
    }

    // Heavy dependencies
    const heavyDeps = analysis.dependencies.filter(dep => dep.size > 100 * 1024)
    if (heavyDeps.length > 0) {
      recommendations.push({
        type: 'optimization',
        title: 'Analyze Heavy Dependencies',
        description: `Found ${heavyDeps.length} dependencies over 100KB. Consider alternatives or dynamic imports.`,
        impact: 'medium',
        effort: 'moderate',
      })
    }

    // Gzip recommendations
    if (analysis.gzippedSize < analysis.totalSize * 0.3) {
      recommendations.push({
        type: 'info',
        title: 'Good Compression',
        description: 'Your bundle compresses well with gzip. Great job!',
        impact: 'low',
        effort: 'easy',
      })
    }

    return recommendations
  }

  /**
   * Generate warnings
   */
  private generateWarnings(analysis: BundleAnalysis): Warning[] {
    const warnings: Warning[] = []

    // Size warnings
    if (analysis.totalSize > 2 * 1024 * 1024) { // > 2MB
      warnings.push({
        type: 'size',
        message: `Bundle size (${this.formatBytes(analysis.totalSize)}) is very large.`,
        severity: 'error',
      })
    } else if (analysis.totalSize > 1024 * 1024) { // > 1MB
      warnings.push({
        type: 'size',
        message: `Bundle size (${this.formatBytes(analysis.totalSize)}) is quite large.`,
        severity: 'warning',
      })
    }

    // Dependency warnings
    const outdatedDeps = analysis.dependencies.filter(dep =>
      this.isDependencyOutdated(dep.name, dep.version),
    )
    if (outdatedDeps.length > 0) {
      warnings.push({
        type: 'dependency',
        message: `Found ${outdatedDeps.length} potentially outdated dependencies.`,
        severity: 'warning',
      })
    }

    return warnings
  }

  /**
   * Print analysis results
   */
  printResults(analysis: BundleAnalysis): void {
    console.log('📊 Bundle Analysis Results\n')

    // Overall stats
    console.log('📏 Overall Size:')
    console.log(`  Total: ${this.formatBytes(analysis.totalSize)}`)
    console.log(`  Gzipped: ${this.formatBytes(analysis.gzippedSize)}`)
    console.log(`  Compression: ${Math.round((1 - analysis.gzippedSize / analysis.totalSize) * 100)}%\n`)

    // Top chunks
    console.log('📦 Largest Chunks:')
    analysis.chunks.slice(0, 5).forEach((chunk, index) => {
      console.log(`  ${index + 1}. ${chunk.name}: ${this.formatBytes(chunk.size)} (${this.formatBytes(chunk.gzippedSize)} gzipped)`)
    })
    console.log('')

    // Top dependencies
    console.log('📚 Largest Dependencies:')
    analysis.dependencies.slice(0, 5).forEach((dep, index) => {
      const status = dep.used ? '✅' : '❌'
      console.log(`  ${index + 1}. ${dep.name}@${dep.version}: ${this.formatBytes(dep.size)} ${status}`)
    })
    console.log('')

    // Recommendations
    if (analysis.recommendations.length > 0) {
      console.log('💡 Recommendations:')
      analysis.recommendations.forEach((rec, index) => {
        const icon = rec.type === 'optimization' ? '⚡' : rec.type === 'warning' ? '⚠️' : 'ℹ️'
        console.log(`  ${index + 1}. ${icon} ${rec.title}`)
        console.log(`     ${rec.description}`)
        console.log(`     Impact: ${rec.impact}, Effort: ${rec.effort}\n`)
      })
    }

    // Warnings
    if (analysis.warnings.length > 0) {
      console.log('⚠️  Warnings:')
      analysis.warnings.forEach((warning, index) => {
        const icon = warning.severity === 'error' ? '❌' : '⚠️'
        console.log(`  ${index + 1}. ${icon} ${warning.message}`)
      })
      console.log('')
    }

    // Summary
    console.log('📈 Summary:')
    console.log(`  Chunks: ${analysis.chunks.length}`)
    console.log(`  Dependencies: ${analysis.dependencies.length}`)
    console.log(`  Assets: ${analysis.assets.length}`)
    console.log(`  Recommendations: ${analysis.recommendations.length}`)
    console.log(`  Warnings: ${analysis.warnings.length}`)
  }

  /**
   * Utility methods
   */
  private getFileSize(filePath: string): number {
    try {
      if (existsSync(filePath)) {
        const stats = require('fs').statSync(filePath)
        return stats.size
      }
    } catch (error) {
      // Ignore errors
    }
    return 0
  }

  private getGzippedSize(filePath: string): number {
    try {
      if (existsSync(filePath)) {
        const content = readFileSync(filePath)
        const zlib = require('zlib')
        const gzipped = zlib.gzipSync(content)
        return gzipped.length
      }
    } catch (error) {
      // Ignore errors
    }
    return 0
  }

  private estimateDependencySize(name: string, gzipped = false): number {
    // Rough estimates for common dependencies
    const sizes: Record<string, number> = {
      react: 42000,
      'react-dom': 130000,
      'react-router-dom': 28000,
      'chart.js': 200000,
      'lucide-react': 150000,
      '@supabase/supabase-js': 80000,
      '@clerk/clerk-react': 120000,
    }

    const size = sizes[name] || 50000 // Default estimate
    return gzipped ? Math.round(size * 0.3) : size
  }

  private isDependencyUsed(name: string): boolean {
    // Simple heuristic - could be improved with static analysis
    const commonUnused = ['@testing-library', 'vitest', 'cypress', 'eslint', 'prettier']
    return !commonUnused.some(prefix => name.includes(prefix))
  }

  private isDependencyOutdated(name: string, version: string): boolean {
    // Simple check - could be improved with npm registry API
    return version.includes('^') || version.includes('~')
  }

  private isAssetOptimized(filePath: string, type: AssetInfo['type']): boolean {
    if (type === 'image') {
      const ext = filePath.split('.').pop()?.toLowerCase()
      return ext === 'webp' || ext === 'avif'
    }
    return true
  }

  private getAllFiles(dir: string): string[] {
    const files: string[] = []
    const items = require('fs').readdirSync(dir)

    for (const item of items) {
      const fullPath = join(dir, item)
      const stat = require('fs').statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath))
      } else {
        files.push(fullPath)
      }
    }

    return files
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) {return '0 B'}

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / k ** i).toFixed(1)) } ${ sizes[i]}`
  }
}

// Run analysis if this file is executed directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer()

  analyzer.analyze()
    .then(analysis => {
      analyzer.printResults(analysis)
    })
    .catch(error => {
      console.error('❌ Bundle analysis failed:', error)
      process.exit(1)
    })
}

export default BundleAnalyzer
