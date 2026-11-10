import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: { root: process.cwd() },
  async headers() {
    return [
      {source:'/:path*',headers:[
        {key:'X-Content-Type-Options',value:'nosniff'},
        {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
        {key:'X-Frame-Options',value:'DENY'},
        {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=(), payment=()'},
        {key:'Cross-Origin-Opener-Policy',value:'same-origin'},
        {key:'Strict-Transport-Security',value:'max-age=31536000; includeSubDomains'}
      ]},
      {source:'/edisi/:page(resto|travel|care).html',headers:[{key:'Content-Security-Policy',value:"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"}]},
      { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/:folder(project-shots|demo-shots|edisi)/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] }
    ];
  }
};
export default nextConfig;
