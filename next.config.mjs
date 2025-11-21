/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Modern image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize for production
  productionBrowserSourceMaps: false,
  
  // Empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;