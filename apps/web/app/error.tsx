// ============================================================
// InterviewIQ — Global Error Boundary
// ============================================================

"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-surface-muted">
        <div className="card max-w-md p-8 text-center">
          <h1 className="heading-3 mb-2">Something went wrong</h1>
          <p className="body-sm mb-6">
            An unexpected error occurred. Please try again.
          </p>
          {process.env.NODE_ENV === "development" && error.message && (
            <pre className="mb-4 rounded-lg bg-danger-50 p-3 text-left text-xs text-danger-700 overflow-auto">
              {error.message}
            </pre>
          )}
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
