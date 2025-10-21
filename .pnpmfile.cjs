module.exports = {
  hooks: {
    readPackage(pkg) {
      // Fix set-cookie-parser for ESM compatibility
      if (pkg.name === 'set-cookie-parser') {
        // Force the package to be treated as CommonJS
        pkg.type = 'commonjs';
        
        // Add exports field for proper module resolution
        pkg.exports = {
          '.': {
            require: './lib/set-cookie.js',
            import: './lib/set-cookie.js',
            default: './lib/set-cookie.js'
          },
          './lib/set-cookie': './lib/set-cookie.js'
        };
        
        // Ensure main points to the correct file
        pkg.main = './lib/set-cookie.js';
      }
      
      // Fix for @clerk/clerk-react if it's causing issues
      if (pkg.name === '@clerk/clerk-react') {
        // Remove problematic dependencies or fix versions
        if (pkg.dependencies && pkg.dependencies['set-cookie-parser']) {
          // Force a specific version that works
          pkg.dependencies['set-cookie-parser'] = '2.6.0';
        }
      }
      
      return pkg;
    }
  }
};
