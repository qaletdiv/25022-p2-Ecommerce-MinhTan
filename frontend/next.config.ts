import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  env: {
    NEXT_PUBLIC_API_URL: 'https://cosmetics-production-e502.up.railway.app',
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
