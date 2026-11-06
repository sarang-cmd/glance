import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/navigation";
import { Mark } from "@/components/brand";
import { Consent } from "@/components/consent";
import { site, github, nav } from "@/lib/content";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Glance | Ad-free Windows 11 widgets",
    template: "%s | Glance",
  },
  description: "Planned ad-free lock screen widgets for Windows 11.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <footer className="footer">
          <div className="container">
            <div className="footer-main">
              <div>
                <Link className="brand" href="/" aria-label="Glance home">
                  <Mark />
                  glance
                </Link>
                <p>
                  A calmer lock screen for Windows 11.
                  <br />
                  Open source. In planning.
                </p>
              </div>
              <div className="footer-links">
                <div>
                  <strong>Explore</strong>
                  {nav.map(([label, url]) => (
                    <Link key={url} href={url}>
                      {label}
                    </Link>
                  ))}
                </div>
                <div>
                  <strong>Follow along</strong>
                  <a href={github}>GitHub ↗</a>
                  <Link href="/get-started">Release list</Link>
                  <a href={`${github}/issues`}>Ideas & issues ↗</a>
                </div>
                <div>
                  <strong>The details</strong>
                  <Link href="/privacy">Privacy Policy</Link>
                  <Link href="/terms">Terms of Service</Link>
                  <Link href="/imprint">Imprint</Link>
                  <a href="mailto:sarang.cmd@gmail.com">Contact</a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <span>
                © {new Date().getFullYear()} Sarang Batra. Glance is MIT
                licensed.
              </span>
              <span>Made for a quieter Windows.</span>
              <Consent />
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
