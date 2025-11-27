/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for optimized Docker builds
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    unoptimized: true,
    // Ensure static images from public folder work in production
    remotePatterns: [],
    formats: ['image/webp', 'image/avif'],
  },
  // Ensure public folder assets are properly served
  trailingSlash: false,
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  // Compress responses
  compress: true,
  // Enable SWC minification (faster than Terser)
  swcMinify: true,
  // Optimize font loading
  optimizeFonts: true,
  // Enable static optimization for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig

