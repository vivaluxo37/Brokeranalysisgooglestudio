/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // For development
  },
  transpilePackages: [],
  experimental: {
    appDir: false, // We're using pages directory
  },
};

module.exports = nextConfig;