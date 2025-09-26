# Broker Analysis Google Studio - Local Development Setup

This document provides instructions for setting up the Broker Analysis Google Studio project for local development and testing.

## Project Overview

Broker Analysis Google Studio is an AI-driven single-page web application built with React and TypeScript to help traders research, compare, and select forex brokers.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (comes with Node.js)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/vivaluxo37/Brokeranalysisgooglestudio.git
cd Brokeranalysisgooglestudio
```

### 2. Install Dependencies

The project uses npm for package management. Install all required dependencies by running:

```bash
npm install
```

### 3. Project Structure

The project is a React/TypeScript application using Vite as the build tool. Key files and directories include:

- `package.json` - Contains project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build tool configuration
- `src/` - Source code directory
  - `components/` - React components
  - `pages/` - Page components
  - `contexts/` - React contexts for state management
  - `hooks/` - Custom React hooks
  - `services/` - API and external service integrations
  - `data/` - Static data files
- `public/` - Public assets
- `tests/` - Test files

### 4. Running the Development Server

To start the development server, run:

```bash
npm run dev
```

This will start the Vite development server, typically on http://localhost:5173

**Note:** If you encounter an error related to `vitest` not being found when starting the dev server, make sure the vite.config.ts file is importing `defineConfig` from 'vite' rather than 'vitest/config'. The file should look like this:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
})
```

### 5. Running Tests

The project uses Vitest for testing. To run the test suite, use:

```bash
npx vitest
```

### 6. Building for Production

To build the project for production, run:

```bash
npm run build
```

This will create a `dist` directory with the optimized build files.

## Additional Scripts

The project includes several npm scripts:

- `dev` - Start the development server (using Vite)
- `build` - Build the project for production
- `preview` - Preview the production build locally
- `sitemap` - Generate a sitemap for the project
- `prerender` - Pre-render pages for better SEO

## Configuration

### TypeScript Configuration

The project uses TypeScript with the following key configurations:
- Target: ES2022
- Module system: ESNext
- JSX transform: react-jsx
- Path aliases: `@/*` points to the root directory

### Vite Configuration

The Vite configuration includes:
- React plugin
- Public directory: `public`
- Test environment setup with jsdom
- Global test setup file: `setupTests.ts`

### Testing Configuration

The project is configured for testing with:
- Vitest as the test runner
- Testing Library for React component testing
- jsdom as the test environment
- Global test setup in `setupTests.ts`

## Troubleshooting

### Common Issues

1. **Dependency Installation Issues**
   - Ensure you have the latest version of Node.js and npm
   - Try clearing the npm cache: `npm cache clean --force`
   - Delete `node_modules` and `package-lock.json`, then run `npm install` again

2. **Development Server Won't Start**
   - Check if port 5173 is available
   - Ensure all dependencies are installed correctly
   - Check for any syntax errors in your code

3. **Tests Fail to Run**
   - Ensure all test dependencies are installed
   - Check the test configuration in `vite.config.ts`
   - Verify the test setup file `setupTests.ts` is correctly configured

## Contributing

When contributing to the project:
1. Follow the existing code style and structure
2. Write tests for new functionality
3. Ensure all tests pass before submitting changes
4. Update documentation as needed

## Support

For additional support or questions about the setup process, please refer to the project's README or contact the project maintainers.