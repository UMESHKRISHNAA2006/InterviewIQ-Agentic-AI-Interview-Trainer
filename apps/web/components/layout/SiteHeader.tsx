// ============================================================
// InterviewIQ — Site Navigation Header
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/config/app.config";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2.5 font-bold text-ink"
            aria-label="InterviewIQ Home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <BrainCircuit className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg">
              Interview<span className="text-brand-600">IQ</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Button size="sm" asChild>
              <Link href={ROUTES.profileSetup}>Start interview</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-ink-muted hover:text-ink"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 md:hidden",
          mobileOpen ? "max-h-64" : "max-h-0",
        )}
        aria-hidden={!mobileOpen}
      >
        <nav className="border-t border-surface-border bg-surface px-4 py-4">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-surface-subtle hover:text-ink"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-surface-border pt-2">
              <Link
                href={ROUTES.profileSetup}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
                onClick={() => setMobileOpen(false)}
              >
                Get started →
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
