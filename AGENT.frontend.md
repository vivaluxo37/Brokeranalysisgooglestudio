# Frontend Agent

## Scope
- Owns the **Brokeranalysisgooglestudio** frontend application: React 19 + Vite 5 app with SSR prerendering and TailwindCSS.
- Manages UI components, pages, React contexts, routing, build/prerender pipeline, and comprehensive testing.
- Ensures performance optimization, accessibility, and maintainable code architecture.

## Primary Responsibilities

### 🚀 Development & Implementation
- Run and iterate the dev server with hot reload
- Implement features in React components/pages following established patterns
- Create and maintain reusable UI component library
- Ensure responsive design and cross-browser compatibility

### 🏗️ Architecture & State Management
- Manage global state via optimized Context providers (Theme, Auth, Comparison, Favorites, Reviews, Alerts, Language, Discussion, TradingJournal, Education, Onboarding, SEO)
- Implement performance optimizations to prevent unnecessary re-renders
- Maintain clean separation of concerns between components and business logic

### 🔧 Build & Deployment
- Maintain build pipeline: client build, SSR build, prerender, and sitemap generation
- Optimize bundle size and implement code splitting strategies
- Ensure build performance and deployment readiness

### 🧪 Testing & Quality Assurance
- Write and maintain comprehensive tests with Vitest and React Testing Library
- Ensure test coverage meets quality standards (target: 80%+)
- Implement accessibility testing and performance monitoring

## Core Commands (run in Brokeranalysisgooglestudio)

### 🔧 Development
```powershell path=null start=null
# Install dependencies
npm install

# Start development server
npm run dev

# Start development server with debug mode
npm run dev:debug

# Clean build artifacts and cache
npm run clean
```

### 📚 Build & Deployment
```powershell path=null start=null
# Production build (client + SSR + prerender)
npm run build

# Preview production build
npm run preview

# Generate sitemap and/or prerender manually
npm run sitemap
npm run prerender

# Analyze bundle size
npm run analyze:bundle
```

### 🧪 Testing
```powershell path=null start=null
# Run all tests once
npm test

# Watch mode for development
npm run test:watch

# Run specific test suites
npm run test:ui        # UI component tests
npm run test:api       # API integration tests
npm run test:coverage  # Test coverage report

# Run a single test file
npx vitest run tests/services/promotionService.test.ts
npx vitest run path\to\your.test.ts
```

### 🔍 Quality Control
```powershell path=null start=null
# Run full quality check (lint + type-check + test)
npm run quality:check

# Linting
npm run lint      # Check for issues
npm run lint:fix  # Fix auto-fixable issues

# Type checking
npm run type-check

# Update dependencies and fix security issues
npm run update-deps
```

Environment
- .env.local in Brokeranalysisgooglestudio
```powershell path=null start=null
GEMINI_API_KEY={{GEMINI_API_KEY}}
VITE_CLERK_PUBLISHABLE_KEY={{VITE_CLERK_PUBLISHABLE_KEY}}
```

Architecture notes
- React 19 + Vite 5; TailwindCSS for styling.
- Routing uses react-router-dom (HashRouter).
- Build pipeline (from package.json):
  - vite build --outDir dist/client
  - vite build --ssr prerender-entry.tsx --outDir dist/server
  - node scripts/prerender.js
- AI integration via @google/genai; business logic for AI features is surfaced through services referenced in CLAUDE.md (e.g., services/backendService.ts).

Editing guidelines
- Keep state colocated within contexts; prefer provider patterns described in CLAUDE.md.
- When adding routes, ensure prerender coverage if SEO is required.
- TailwindCSS is primary styling tool; prefer utility classes and existing conventions.