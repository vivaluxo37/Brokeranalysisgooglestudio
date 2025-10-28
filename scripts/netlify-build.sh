#!/bin/bash
set -euo pipefail

# Netlify build script for production deployment
echo "Starting Netlify build process..."

# Ensure corepack is available for pnpm if needed
echo "Enabling corepack..."
corepack enable || echo "Corepack not available, continuing with npm"

# Install dependencies
echo "Installing dependencies..."
npm ci --omit=optional

# Run the build
echo "Building the application..."
npm run build:ci

# Verify the output directory exists
echo "Verifying build output directory..."
if [ ! -d "dist/client" ]; then
  echo "ERROR: Build output directory 'dist/client' does not exist!"
  echo "Contents of dist/ (if it exists):"
  ls -la dist/ 2>/dev/null || echo "dist/ directory does not exist"
  exit 1
fi

echo "Build completed successfully!"
echo "Contents of dist/client:"
ls -la dist/client/
