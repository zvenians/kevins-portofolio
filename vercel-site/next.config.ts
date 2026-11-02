import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/resume', destination: '/#resume', permanent: false }];
  },
  async headers() {
    return [{ source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }];
  }
};
export default nextConfig;
