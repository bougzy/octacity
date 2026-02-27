"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur bg-[var(--nav-bg)] border-b border-[var(--card-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">OC</span>
            </div>
            <span className="text-xl font-bold gradient-text">Octa City Bank</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/grants" className="text-[var(--muted)] hover:text-white transition-colors text-sm">Grants</Link>
            <Link href="/faq" className="text-[var(--muted)] hover:text-white transition-colors text-sm">FAQ</Link>
            <Link href="/about" className="text-[var(--muted)] hover:text-white transition-colors text-sm">About</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[var(--muted)] hover:text-white transition-colors text-sm hidden sm:block">Sign In</Link>
            <Link href="/register" className="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium">Get Started</Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[var(--muted)] hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--card-border)] py-4 space-y-3">
            <Link href="/grants" className="block text-[var(--muted)] hover:text-white transition-colors text-sm" onClick={() => setMobileOpen(false)}>Grants</Link>
            <Link href="/faq" className="block text-[var(--muted)] hover:text-white transition-colors text-sm" onClick={() => setMobileOpen(false)}>FAQ</Link>
            <Link href="/about" className="block text-[var(--muted)] hover:text-white transition-colors text-sm" onClick={() => setMobileOpen(false)}>About</Link>
            <Link href="/login" className="block text-[var(--muted)] hover:text-white transition-colors text-sm" onClick={() => setMobileOpen(false)}>Sign In</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
