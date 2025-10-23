#!/bin/bash

# Netlify build script to ensure correct platform dependencies
echo "Starting Netlify build process..."

# Clean up any existing installations
echo "Cleaning up previous installations..."
rm -rf node_modules package-lock.json

# Install dependencies with legacy peer deps
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Explicitly install rollup Linux binary if needed
echo "Ensuring rollup Linux binary is installed..."
npm install @rollup/rollup-linux-x64-gnu --save-optional --legacy-peer-deps || true

# Run the build
echo "Building the application..."
npm run build

echo "Build completed successfully!"
