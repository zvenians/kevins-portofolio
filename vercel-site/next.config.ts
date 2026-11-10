import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  async headers() {
    return [
      {source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'}]},
      {source:'/edisi/:page(resto|travel|care).html',headers:[{key:'Content-Security-Policy',value:"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"}]},
      { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }
    ];
  }
};
export default nextConfig;
