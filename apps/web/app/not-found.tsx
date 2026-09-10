// ============================================================
// InterviewIQ — 404 Not Found
// ============================================================

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ROUTES } from "@/config/app.config";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="container-narrow text-center">
          {/* Simple editorial illustration for 404 */}
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-surface-subtle">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              aria-hidden="true"
            >
              <circle cx="32" cy="32" r="28" stroke="#e4e7f0" strokeWidth="2" />
              <circle cx="24" cy="28" r="3" fill="#a0aec0" />
              <circle cx="40" cy="28" r="3" fill="#a0aec0" />
              <path
                d="M22 42 Q32 36 42 42"
                stroke="#a0aec0"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <text x="17" y="20" fontSize="10" fill="#6366f1" fontWeight="700">404</text>
            </svg>
          </div>

          <h1 className="heading-2 mb-3">Page not found</h1>
          <p className="body-base mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link href={ROUTES.home}>Go home</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={ROUTES.profileSetup}>Start interview</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
