import type {NextConfig} from 'next';
const production=process.env.NODE_ENV==='production';
const csp=["default-src 'self'", "script-src 'self' 'unsafe-inline'"+(production?'':" 'unsafe-eval'")+" https://eu-assets.i.posthog.com", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:", "font-src 'self'", "connect-src 'self' https://eu.i.posthog.com https://eu-assets.i.posthog.com", "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'"].join('; ');
const config:NextConfig={productionBrowserSourceMaps:false,allowedDevOrigins:['*.e2b.app'],async headers(){return [{source:'/(.*)',headers:[{key:'Content-Security-Policy',value:csp},{key:'Strict-Transport-Security',value:'max-age=31536000; includeSubDomains'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},{key:'X-Content-Type-Options',value:'nosniff'}]}]}};
export default config;
