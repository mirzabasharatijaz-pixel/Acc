import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AccFlipper | Escrow marketplace for digital assets",
  description: "Buy and sell digital assets safely with a 7-day escrow timer and built-in disputes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b bg-white/60 backdrop-blur">
          <div className="container flex items-center justify-between py-4">
            <Link href="/" className="text-xl font-semibold text-brand-700">
              AccFlipper
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
              <Link href="/listings">Marketplace</Link>
              <Link href="/orders">Orders</Link>
              <Link href="/auth/login" className="btn px-3 py-2 text-white">
                Sign in
              </Link>
            </nav>
          </div>
        </header>
        <main className="container py-8 space-y-8">{children}</main>
        <footer className="border-t bg-white/70 py-6 text-center text-xs text-slate-500">
          Built for secure account trading · 7-day buyer protection · Admin escrow control
        </footer>
      </body>
    </html>
  );
}
