import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}

export default nextConfig
