// ============================================================
// InterviewIQ — Site Footer
// ============================================================

import React from "react";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import { APP_CONFIG } from "@/config/app.config";

export function SiteFooter() {
  return (
    <footer className="border-t border-surface-border bg-surface-muted">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
                <BrainCircuit className="h-4 w-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-ink">
                Interview<span className="text-brand-600">IQ</span>
              </span>
            </div>
            <p className="body-sm max-w-xs">
              AI-powered interview training, personalised for your role and experience.
            </p>
            <p className="caption">
              Built with IBM watsonx — AICTE/IBM Internship 2025
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="label mb-3">Product</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="#how-it-works" className="caption hover:text-ink transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#features" className="caption hover:text-ink transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* IBM Attribution */}
          <div>
            <h3 className="label mb-3">Powered by</h3>
            <ul className="flex flex-col gap-2">
              <li className="caption">IBM watsonx.ai — Granite 4.0</li>
              <li className="caption">IBM watsonx Orchestrate</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-surface-border pt-6 sm:flex-row">
          <p className="caption">
            © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
          <p className="caption">Version {APP_CONFIG.version}</p>
        </div>
      </div>
    </footer>
  );
}
