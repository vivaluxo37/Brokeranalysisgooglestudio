# Development Guide

This guide covers the development setup, workflow, and best practices for the Broker Analysis application.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Git
- VS Code (recommended)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brokeranalysisgooglestu
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env.local
   # Add your environment variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
brokeranalysisgooglestu/
├── api/                    # Backend proxy server
│   ├── proxy-server.js     # Main API proxy
│   └── package.json         # Backend dependencies
├── components/             # React components
│   ├── error/              # Error boundaries
│   ├── lazy/               # Lazy loading components
│   ├── ui/                 # UI components
│   └── ...
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── pages/                  # Page components
├── services/               # Service layer
│   ├── ai/                 # AI services
│   ├── data/               # Data services
│   └── ...
├── utils/                  # Utility functions
├── types.ts                # TypeScript type definitions
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🛠️ Development Workflow

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes**
   - Follow coding standards
   - Add tests for new features
   - Update documentation

3. **Quality checks**
   ```bash
   npm run lint
   npm run type-check
   npm run test
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/new-feature
   ```

### Code Quality

Run all quality checks before committing:

```bash
# Lint code
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test

# Bundle analysis
npm run analyze:bundle
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks (configured in package.json):

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run type-check",
      "pre-push": "npm run test"
    }
  }
}
```

## 🎨 Coding Standards

### TypeScript

- Use strict TypeScript mode
- Prefer explicit return types for public APIs
- Use interfaces for object shapes
- Avoid `any` type

```typescript
// Good
interface Broker {
  id: string;
  name: string;
  score: number;
}

const getBroker = (id: string): Broker | null => {
  // Implementation
};

// Avoid
const getBroker = (id: any): any => {
  // Implementation
};
```

### React Components

- Use functional components with hooks
- Follow naming conventions (PascalCase for components)
- Include PropTypes/TypeScript interfaces
- Use error boundaries for error handling

```typescript
// Good component structure
interface ButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, variant, onClick }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

### CSS/Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use CSS variables for theme values
- Avoid inline styles when possible

```typescript
// Good
<div className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg">
  Content
</div>

// Avoid
<div style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
  Content
</div>
```

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts`
- Utils: `camelCase.ts`
- Services: `camelCase.ts`
- Types: `camelCase.ts`

### Import/Export

```typescript
// Group imports
import React, { useState, useEffect } from 'react';
import { useRouter } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useBroker } from '@/hooks/useBroker';
import type { Broker } from '@/types';

// Named exports
export const Component = () => {};

// Default exports for main components
export default Component;
```

## 🧪 Testing

### Test Structure

```
tests/
├── components/            # Component tests
├── hooks/                # Hook tests
├── services/             # Service tests
├── utils/                # Utility tests
└── __mocks__/            # Mock files
```

### Testing Best Practices

- Use descriptive test names
- Test happy paths and edge cases
- Mock external dependencies
- Keep tests simple and focused

```typescript
// Example test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button variant="primary" onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test Button
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```bash
# AI Services
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_AI_FEATURES=true

# Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Database
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Development
VITE_ENABLE_DEBUG_MODE=false
```

### Vite Configuration

The Vite configuration is in `vite.config.ts`:

- Build optimization
- Code splitting
- Development server settings
- Alias configuration

### TypeScript Configuration

TypeScript configuration is in `tsconfig.json`:

- Strict mode enabled
- Path aliases
- Build options
- Library definitions

## 🎯 Development Features

### Hot Module Replacement

The development server supports HMR for fast development:

- Component updates without page reload
- CSS changes apply instantly
- State preservation during updates

### Development Tools

- **React DevTools** - Component inspection and debugging
- **Redux DevTools** - State management debugging
- **Console** - Application logging
- **Network Tab** - API request debugging

### Debug Mode

Enable debug mode in `.env.local`:

```bash
VITE_ENABLE_DEBUG_MODE=true
```

This enables:
- Verbose logging
- Performance metrics
- Debug components

## 📦 Build and Deployment

### Development Build

```bash
npm run build
```

Creates optimized production build in `dist/` directory.

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Start proxy server**
   ```bash
   npm run proxy:start
   ```

### Environment-Specific Builds

- **Development**: Source maps, hot reload, verbose logging
- **Production**: Minified, optimized, secure

## 🔄 API Development

### Backend Proxy Server

The proxy server is in the `api/` directory:

```bash
cd api
npm install
npm run dev
```

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/chatbot` - Chatbot requests
- `POST /api/tutor` - Educational content
- `POST /api/broker-matcher` - Broker recommendations

### API Testing

```bash
# Test API health
curl http://localhost:3001/api/health

# Test chatbot
curl -X POST http://localhost:3001/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

## 🐛 Debugging

### Common Issues

1. **Module not found**
   - Check file paths in imports
   - Verify TypeScript configuration
   - Ensure file exists and exports correctly

2. **TypeScript errors**
   - Run `npm run type-check`
   - Check type definitions
   - Ensure proper typing

3. **Performance issues**
   - Use React DevTools Profiler
   - Check bundle size analyzer
   - Monitor Core Web Vitals

4. **API errors**
   - Check proxy server status
   - Verify environment variables
   - Check network connectivity

### Debug Tools

- **React DevTools** - Component inspection
- **Network Tab** - API requests
- **Console** - Error logging
- **Performance Tab** - Runtime performance

## 📚 Learning Resources

### React Documentation

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools and Libraries

- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [Vitest Testing](https://vitest.dev/)

### Best Practices

- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Performance Best Practices](https://web.dev/performance/)

## 🤝 Contributing

### Before Contributing

1. Read this guide thoroughly
2. Set up development environment
3. Understand the project structure
4. Check existing issues and PRs

### Making Changes

1. Create a feature branch
2. Make small, focused changes
3. Add tests for new functionality
4. Update documentation
5. Ensure all tests pass

### Submitting Changes

1. Create a pull request
2. Describe changes clearly
3. Link related issues
4. Request review from maintainers

---

**Last Updated:** January 2025
**Review Frequency:** Monthly
**Maintainer:** Development Team
