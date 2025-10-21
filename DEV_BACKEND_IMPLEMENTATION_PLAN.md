# Dev Backend Implementation Plan

## Problem Summary
1. **404 errors for /api/users POST requests**: `userService.createUser()` is trying to POST to `/api/users` but the Next.js route at `api/users/route.ts` only implements GET and PUT methods
2. **Module preload failures**: The dependency preloader is failing to resolve modules like 'react-router-dom', 'lucide-react', etc. due to dynamic import issues

## Solution: Dev Stub Backend Approach

### 1. Add /api/users Endpoints to proxy-server.js

Add the following endpoints to `api/proxy-server.js` after the existing endpoints (around line 299):

```javascript
// Users API endpoints for development
app.post('/api/users', async (req, res) => {
  try {
    const { id, email, name, preferences } = req.body;
    
    // Validate required fields
    if (!id || !email || !name) {
      return res.status(400).json({
        error: 'Missing required fields: id, email, name'
      });
    }
    
    // Mock user data storage (in production, this would be a database)
    const mockUser = {
      id,
      email,
      name,
      preferences: preferences || {},
      created_at: new Date().toISOString(),
      avatar_url: null,
      trading_level: 'beginner',
      trading_experience: 'none',
      preferred_instruments: [],
      risk_tolerance: 'medium'
    };
    
    console.log('[Dev API] Created user:', mockUser);
    
    res.json({
      success: true,
      user: mockUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }
    
    // Mock user data (in production, this would be a database query)
    const mockUser = {
      id,
      email: `user-${id}@example.com`,
      name: `User ${id}`,
      preferences: {
        tradingLevel: 'beginner',
        riskTolerance: 'medium'
      },
      created_at: new Date().toISOString(),
      avatar_url: null,
      trading_level: 'beginner',
      trading_experience: 'none',
      preferred_instruments: ['EUR/USD', 'GBP/USD'],
      risk_tolerance: 'medium'
    };
    
    console.log('[Dev API] Retrieved user:', mockUser);
    
    res.json({
      success: true,
      user: mockUser
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

app.put('/api/users', async (req, res) => {
  try {
    const { id, name, preferences } = req.body;
    
    if (!id) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }
    
    // Mock updated user data
    const mockUpdatedUser = {
      id,
      email: `user-${id}@example.com`,
      name: name || `User ${id}`,
      preferences: preferences || {},
      updated_at: new Date().toISOString(),
      avatar_url: null,
      trading_level: 'beginner',
      trading_experience: 'none',
      preferred_instruments: ['EUR/USD', 'GBP/USD'],
      risk_tolerance: 'medium'
    };
    
    console.log('[Dev API] Updated user:', mockUpdatedUser);
    
    res.json({
      success: true,
      user: mockUpdatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message
    });
  }
});

app.delete('/api/users', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        error: 'User ID is required'
      });
    }
    
    console.log('[Dev API] Deleted user:', id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: error.message
    });
  }
});
```

### 2. Update userService.ts API_BASE_URL

Update `Brokeranalysisgooglestudio/services/userService.ts` line 4-6 to use the proxy server:

```typescript
// Base API URL - adjust according to your deployment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.vercel.app' 
  : 'http://localhost:3001'; // Changed from 3000 to 3001 for dev
```

### 3. Fix Dependency Preloader Module Resolution

Update `src/utils/dependencyPreloader.ts` to use static import mapping instead of dynamic imports:

Replace the `preloadModule` method (lines 265-275) with:

```typescript
/**
 * Static import map for reliable module preloading
 */
private readonly importMap: Record<string, () => Promise<any>> = {
  'react-router-dom': () => import('react-router-dom'),
  'lucide-react': () => import('lucide-react'),
  'react-chartjs-2': () => import('react-chartjs-2'),
  '@heroicons/react': () => import('@heroicons/react'),
}

/**
 * Preload a specific module using static import map
 */
async preloadModule(moduleName: string): Promise<any> {
  try {
    const moduleImporter = this.importMap[moduleName];
    if (!moduleImporter) {
      console.warn(`[Preloader] Module not in import map: ${moduleName}`)
      return null;
    }
    
    const module = await moduleImporter();
    console.log(`[Preloader] Module preloaded: ${moduleName}`)
    return module
  } catch (error) {
    console.warn(`[Preloader] Failed to preload module: ${moduleName}`, error)
    throw error
  }
}
```

### 4. Update Preloader Configuration

Update the config in `dependencyPreloader.ts` to remove problematic modules from dynamic preloading:

Lines 33-49, update the config:

```typescript
// Configuration for different dependency types
private readonly config: PreloadConfig = {
  critical: [
    // Core React dependencies
    { source: '/node_modules/.vite/deps/react.js', kind: 'url' },
    { source: '/node_modules/.vite/deps/react-dom.js', kind: 'url' },
    { source: '/node_modules/.vite/deps/react-dom_client.js', kind: 'url' },
  ],
  important: [
    // Authentication remains URL-based because Vite currently emits stable path
    { source: '/node_modules/.vite/deps/@clerk_clerk-react.js', kind: 'url' },
    
    // Removed react-router-dom and lucide-react from here - they're handled by importMap
  ],
  optional: [
    // Removed react-chartjs-2 and @heroicons/react from here - they're handled by importMap
  ]
}
```

And update the preload methods to use the importMap:

```typescript
/**
 * Preload important dependencies
 */
private preloadImportant(): void {
  console.log('[Preloader] Loading important dependencies...')
  
  // Preload URL-based dependencies
  this.config.important.forEach((entry) => {
    if (entry.kind === 'url') {
      this.dispatchPreload(entry, 'auto')
    }
  })
  
  // Preload module-based dependencies using importMap
  Object.keys(this.importMap).forEach(moduleName => {
    this.preloadModule(moduleName)
      .then(() => {
        this.preloadedAssets.add(`module:${moduleName}`)
      })
      .catch((error) => {
        console.warn(`[Preloader] Failed to preload module: ${moduleName}`, error)
      })
  })
}

/**
 * Preload optional dependencies
 */
private preloadOptional(): void {
  console.log('[Preloader] Loading optional dependencies...')
  
  // Most optional dependencies are now handled by importMap in preloadImportant
  // This method can be used for truly optional URL-based resources
}
```

## Implementation Steps

1. Add the /api/users endpoints to proxy-server.js
2. Update userService.ts to use port 3001 for development
3. Refactor dependencyPreloader.ts to use static import mapping
4. Test the admin login flow to ensure 404 errors are resolved
5. Verify module preloading works without console errors
6. Update the todo list and provide final instructions

## Expected Results

- No more 404 errors for /api/users POST requests
- No more "Failed to resolve module specifier" errors in console
- Admin login flow works smoothly
- Module preloading works reliably for development

## Files to Modify

1. `api/proxy-server.js` - Add /api/users endpoints
2. `Brokeranalysisgooglestudio/services/userService.ts` - Update API_BASE_URL
3. `src/utils/dependencyPreloader.ts` - Refactor to use static import mapping