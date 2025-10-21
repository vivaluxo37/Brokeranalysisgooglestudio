/**
 * Prettier Configuration
 * Consistent code formatting rules
 */

module.exports = {
  // Print width - line length that Prettier will try to maintain
  printWidth: 100,
  
  // Tab width - number of spaces per indentation-level
  tabWidth: 2,
  
  // Use tabs instead of spaces
  useTabs: false,
  
  // Semicolons at the ends of statements
  semi: true,
  
  // Use single quotes instead of double quotes
  singleQuote: true,
  
  // Quote style for object properties
  quoteProps: 'as-needed',
  
  // Use single quotes in JSX
  jsxSingleQuote: true,
  
  // Trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',
  
  // Spaces between brackets in object literals
  bracketSpacing: true,
  
  // Put the > of a multi-line JSX element at the end of the last line
  bracketSameLine: false,
  
  // Include parentheses around a sole arrow function parameter
  arrowParens: 'avoid',
  
  // Format only files that have a pragma comment at the top
  requirePragma: false,
  
  // Insert pragma comment at the top of formatted files
  insertPragma: false,
  
  // How to handle whitespace in prose
  proseWrap: 'preserve',
  
  // How to handle whitespace in HTML
  htmlWhitespaceSensitivity: 'css',
  
  // Line ending style
  endOfLine: 'lf',
  
  // Control whether Prettier formats quoted code embedded in the file
  embeddedLanguageFormatting: 'auto',
  
  // Enforce single attribute per line in HTML, Vue and JSX
  singleAttributePerLine: false,
  
  // Plugin configurations
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss'
  ],
  
  // Import sorting configuration
  importOrder: [
    // React imports first
    '^react$',
    '^react-dom$',
    '^react-router-dom$',
    
    // Third-party libraries
    '^@?\\w',
    
    // Internal imports (aliased)
    '^@/(.*)$',
    
    // Relative imports
    '^\\.(?!/?$)',
    '^\\./?$',
    
    // Type imports
    '^.*\\.type$',
    '^.*\\.d\\.ts$'
  ],
  
  importOrderSeparation: true,
  
  importOrderSortSpecifiers: true,
  
  // Tailwind CSS classes sorting
  tailwindConfig: './tailwind.config.js',
  tailwindFunctions: ['clsx', 'cn', 'tw', 'twMerge'],
  
  // Override rules for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always'
      }
    },
    {
      files: '*.html',
      options: {
        printWidth: 120,
        htmlWhitespaceSensitivity: 'ignore'
      }
    },
    {
      files: '*.css',
      options: {
        printWidth: 120,
        singleQuote: false
      }
    },
    {
      files: '*.scss',
      options: {
        printWidth: 120,
        singleQuote: false
      }
    },
    {
      files: '*.{ts,tsx}',
      options: {
        // TypeScript specific formatting
        parser: 'typescript',
        semi: true,
        singleQuote: true
      }
    },
    {
      files: '*.{js,jsx}',
      options: {
        // JavaScript specific formatting
        semi: true,
        singleQuote: true
      }
    }
  ]
};
