import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/fraunces/index.css';
import '@fontsource-variable/public-sans/index.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConsentBanner from '@/components/ConsentBanner';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Glance — Ad-free lock screen widgets for Windows 11',
    template: '%s · Glance'
  },
  description: site.description,
  applicationName: 'Glance',
  authors: [{ name: site.founder, url: site.github }],
  creator: site.founder,
  keywords: ['Windows 11 widgets', 'lock screen widgets', 'ad-free widgets', 'habit tracker', 'battery health', 'open source'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Glance',
    locale: 'en_US',
    url: '/',
    title: 'Glance — Ad-free lock screen widgets for Windows 11',
    description: site.description,
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'Glance, ad-free lock screen widgets for Windows 11' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glance — Ad-free lock screen widgets for Windows 11',
    description: site.description,
    images: ['/og/home.png']
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }]
  },
  manifest: '/site.webmanifest'
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f4' },
    { media: '(prefers-color-scheme: dark)', color: '#151a17' }
  ]
};

const themeInit = `(function(){try{var t=localStorage.getItem('glance-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
