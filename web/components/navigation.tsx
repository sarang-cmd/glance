"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { nav, github } from "@/lib/content";
import { Mark } from "./brand";
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  return (
    <header className="header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Glance home">
          <Mark />
          glance
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([label, url]) => (
            <Link
              key={url}
              href={url}
              aria-current={path === url ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="source-link"
            href={github}
            aria-label="Star on GitHub: Glance"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
            </svg>
            <span>Star on GitHub</span>
          </a>
          <Link href="/get-started" className="button small">
            Join release list
          </Link>
        </div>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            className="menu-trigger"
            aria-label="Menu: open navigation"
          >
            Menu <span aria-hidden="true">☰</span>
          </Dialog.Trigger>
          <AnimatePresence>
            {open && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild>
                  <motion.div
                    className="menu-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild aria-describedby={undefined}>
                  <motion.div
                    className="mobile-menu"
                    initial={{ y: reduced ? 0 : -15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Dialog.Title>Explore Glance</Dialog.Title>
                    <Dialog.Close
                      className="menu-close"
                      aria-label="Close navigation"
                    >
                      Close ×
                    </Dialog.Close>
                    <nav aria-label="Mobile navigation">
                      {[
                        ["Home", "/"],
                        ...nav,
                        ["Join release list", "/get-started"],
                      ].map(([label, url]) => (
                        <Link
                          href={url}
                          key={url}
                          onClick={() => setOpen(false)}
                        >
                          {label}
                        </Link>
                      ))}
                      <a href={github}>Star on GitHub ↗</a>
                    </nav>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </div>
    </header>
  );
}
