import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Glance',
    short_name: 'Glance',
    description: 'Ad-free lock screen widgets for Windows 11.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#faf8f4',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
