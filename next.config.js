/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable standalone output for optimized Docker builds
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
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
  // Webpack configuration to handle dynamic imports more reliably
  webpack: (config, { isServer }) => {
    // Ensure proper handling of dynamic imports
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Improve error handling for module loading
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    
    return config;
  },
}

module.exports = nextConfig

