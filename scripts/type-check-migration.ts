/**
 * TypeScript Migration Helper
 * Helps identify and fix type errors when migrating to strict mode
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

interface TypeCheckResult {
  file: string;
  errors: string[];
  warnings: string[];
  fixed: boolean;
}

class TypeCheckMigration {
  private readonly projectRoot: string
  private readonly excludedFiles: string[] = [
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.vite',
    'api',
    '*.test.*',
    '*.spec.*',
  ]

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
  }

  /**
   * Run TypeScript compiler and parse errors
   */
  async runTypeCheck(): Promise<TypeCheckResult[]> {
    console.log('🔍 Running TypeScript type check...')

    try {
      const output = execSync('npx tsc --noEmit --pretty false', {
        cwd: this.projectRoot,
        encoding: 'utf8',
      })

      console.log('✅ No type errors found!')
      return []
    } catch (error: any) {
      const errorOutput = error.stdout || error.message
      return this.parseTypeScriptErrors(errorOutput)
    }
  }

  /**
   * Parse TypeScript error output
   */
  private parseTypeScriptErrors(output: string): TypeCheckResult[] {
    const lines = output.split('\n')
    const results: TypeCheckResult[] = []
    let currentResult: TypeCheckResult | null = null

    for (const line of lines) {
      // Match TypeScript error format: file(line,column): error TSxxxx: message
      const errorMatch = line.match(/^(.+)\((\d+),(\d+)\):\s*(error|warning)\s+(TS\d+):\s*(.+)$/)

      if (errorMatch) {
        const [, file, lineNum, colNum, type, code, message] = errorMatch

        // Skip excluded files
        if (this.isExcludedFile(file)) {
          continue
        }

        if (!currentResult || currentResult.file !== file) {
          currentResult = {
            file,
            errors: [],
            warnings: [],
            fixed: false,
          }
          results.push(currentResult)
        }

        const errorMessage = `[Line ${lineNum}:${colNum}] ${code}: ${message}`

        if (type === 'error') {
          currentResult.errors.push(errorMessage)
        } else {
          currentResult.warnings.push(errorMessage)
        }
      }
    }

    return results
  }

  /**
   * Check if file should be excluded from processing
   */
  private isExcludedFile(filePath: string): boolean {
    return this.excludedFiles.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'))
        return regex.test(filePath)
      }
      return filePath.includes(pattern)
    })
  }

  /**
   * Auto-fix common TypeScript issues
   */
  async fixCommonIssues(results: TypeCheckResult[]): Promise<TypeCheckResult[]> {
    console.log('🔧 Attempting to auto-fix common issues...')

    for (const result of results) {
      if (!existsSync(result.file)) {
        continue
      }

      try {
        let content = readFileSync(result.file, 'utf8')
        let modified = false

        // Fix 1: Add explicit return types to functions
        content = this.addReturnTypes(content)
        if (content !== readFileSync(result.file, 'utf8')) {modified = true}

        // Fix 2: Add type annotations to variables
        content = this.addTypeAnnotations(content)
        if (content !== readFileSync(result.file, 'utf8')) {modified = true}

        // Fix 3: Fix optional properties
        content = this.fixOptionalProperties(content)
        if (content !== readFileSync(result.file, 'utf8')) {modified = true}

        // Fix 4: Add missing null checks
        content = this.addNullChecks(content)
        if (content !== readFileSync(result.file, 'utf8')) {modified = true}

        if (modified) {
          writeFileSync(result.file, content)
          result.fixed = true
          console.log(`✅ Fixed issues in ${result.file}`)
        }
      } catch (error) {
        console.error(`❌ Failed to fix ${result.file}:`, error)
      }
    }

    return results
  }

  /**
   * Add explicit return types to functions
   */
  private addReturnTypes(content: string): string {
    // Fix function declarations without return types
    content = content.replace(
      /function\s+(\w+)\s*\([^)]*\)\s*{/g,
      (match, funcName) => {
        // Don't add return type if already present
        if (match.includes(':')) {return match}
        return match.replace('{', ': void {')
      },
    )

    // Fix arrow functions without return types
    content = content.replace(
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{/g,
      (match, funcName) => {
        if (match.includes(':')) {return match}
        return match.replace('=>', ': void =>')
      },
    )

    return content
  }

  /**
   * Add type annotations to variables
   */
  private addTypeAnnotations(content: string): string {
    // Add types to untyped variables
    content = content.replace(
      /(?:const|let|var)\s+(\w+)\s*=\s*(\{[^}]+\}|\[[^\]]+\]|\d+|'[^']*'|"[^"]*"|true|false|null)/g,
      (match, varName, value) => {
        if (match.includes(':')) {return match}

        let type = 'any'
        if (value.startsWith('{')) {type = 'Record<string, any>'} else if (value.startsWith('[')) {type = 'any[]'} else if (/^\d+$/.test(value)) {type = 'number'} else if (value.startsWith("'") || value.startsWith('"')) {type = 'string'} else if (value === 'true' || value === 'false') {type = 'boolean'} else if (value === 'null') {type = 'null'}

        return match.replace(varName, `${varName}: ${type}`)
      },
    )

    return content
  }

  /**
   * Fix optional properties
   */
  private fixOptionalProperties(content: string): string {
    // Fix optional property access
    content = content.replace(
      /(\w+)\.(\w+)/g,
      (match, obj, prop) => {
        // Skip if already optional or if it's a safe access
        if (match.includes('?.') || match.includes('?.') || obj === 'console') {return match}

        // Common safe objects
        const safeObjects = ['window', 'document', 'localStorage', 'sessionStorage', 'navigator']
        if (safeObjects.includes(obj)) {return match}

        return `${obj}?.${prop}`
      },
    )

    return content
  }

  /**
   * Add null checks
   */
  private addNullChecks(content: string): string {
    // Add null checks before array access
    content = content.replace(
      /(\w+)\[(\d+)\]/g,
      (match, array, index) => {
        if (match.includes('?.')) {return match}
        return `${array}?.[${index}]`
      },
    )

    return content
  }

  /**
   * Generate migration report
   */
  generateReport(results: TypeCheckResult[]): void {
    console.log('\n📊 TypeScript Migration Report\n')

    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0)
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0)
    const fixedFiles = results.filter(r => r.fixed).length

    console.log(`📁 Files with issues: ${results.length}`)
    console.log(`❌ Total errors: ${totalErrors}`)
    console.log(`⚠️  Total warnings: ${totalWarnings}`)
    console.log(`✅ Files auto-fixed: ${fixedFiles}`)

    if (results.length > 0) {
      console.log('\n📋 Files requiring manual attention:')
      results.forEach(result => {
        if (!result.fixed && (result.errors.length > 0 || result.warnings.length > 0)) {
          console.log(`\n📄 ${result.file}`)

          if (result.errors.length > 0) {
            console.log('  Errors:')
            result.errors.forEach(error => console.log(`    - ${error}`))
          }

          if (result.warnings.length > 0) {
            console.log('  Warnings:')
            result.warnings.forEach(warning => console.log(`    - ${warning}`))
          }
        }
      })
    }

    console.log('\n💡 Recommendations:')
    if (totalErrors > 0) {
      console.log('  1. Fix remaining errors manually')
      console.log('  2. Run the script again to check progress')
      console.log('  3. Focus on one file at a time')
    }
    if (totalWarnings > 0) {
      console.log('  4. Address warnings for better type safety')
    }
    if (fixedFiles > 0) {
      console.log('  5. Review auto-fixed files for correctness')
    }
  }

  /**
   * Run the complete migration process
   */
  async run(): Promise<void> {
    try {
      // Step 1: Run initial type check
      let results = await this.runTypeCheck()

      if (results.length === 0) {
        console.log('🎉 TypeScript migration complete! No issues found.')
        return
      }

      // Step 2: Attempt to auto-fix issues
      results = await this.fixCommonIssues(results)

      // Step 3: Run type check again to see remaining issues
      console.log('\n🔍 Running second type check after auto-fixes...')
      const remainingResults = await this.runTypeCheck()

      // Step 4: Generate report
      this.generateReport(remainingResults)

    } catch (error) {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    }
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  const migration = new TypeCheckMigration()
  migration.run().catch(console.error)
}

export default TypeCheckMigration
