/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  output: 'standalone',

  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', '@supabase/supabase-js'],
  },

  compress: true,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;