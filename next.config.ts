import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Add supbase to image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/**',
      },
    ],
  },
  /* config options here */
  async rewrites() {
    return [
      {
        // This matches any path that ends with .md
        source: '/:path*.md',
        // And forwards it to our dedicated markdown renderer API route
        destination: '/api/markdown-renderer?path=:path*',
      },
    ];
  },
};

export default nextConfig;
