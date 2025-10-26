#!/bin/bash

# Netlify build script for production deployment
echo "Starting Netlify build process..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run the build
echo "Building the application..."
npm run build

echo "Build completed successfully!"
