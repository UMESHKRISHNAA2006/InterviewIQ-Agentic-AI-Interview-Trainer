# InterviewIQ — Architecture

## Overview

InterviewIQ is an agentic AI interview training platform built as a Next.js 14 monorepo. It integrates IBM watsonx.ai (Granite) for analysis tasks and IBM watsonx Orchestrate for adaptive interview conversations.

```
interviewiq/
├── apps/web/          ← Next.js 14 (App Router) — frontend + BFF API
└── docs/              ← Architecture and integration documentation
```

---

## Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (Client)                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React Components  ←→  Zustand Stores  ←→  API Client   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                    ↕ (HTTPS, JSON)                              │
└─────────────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────────────┐
│  Next.js BFF (API Routes — server-side only)                     │
│  /api/interview/*    /api/profile    /api/resume/*   /api/ibm/* │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────────────────────────┐  │
│  │  Zod Validators │  │  IBM Clients (granite.ts, orchestrate │  │
│  │  Error handling │  │  .ts, iam.ts) — server-side ONLY      │  │
│  └─────────────────┘  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          │                               │
┌─────────┴──────────┐         ┌──────────┴──────────────────────┐
│  IBM watsonx.ai    │         │  IBM watsonx Orchestrate         │
│  (Granite 4.0)     │         │  (Deployed Interview Agent)      │
│  us-south/Dallas   │         │  au-syd/Sydney                   │
│                    │         │                                  │
│  • Profile extract │         │  • Adaptive interview conductor  │
│  • JD analysis     │         │  • Answer evaluation             │
│  • Skill-gap score │         │  • Session management            │
└────────────────────┘         │  • Performance report generation │
                               └──────────────────────────────────┘
```

---

## Key Principle: IBM Credentials Never Reach the Browser

All IBM API keys, tokens, and secrets are accessed only in **server-side** Next.js API routes. The browser-side code never imports `config/ibm.config.ts` or `lib/ibm/*`.

```
ALLOWED:  app/api/**/route.ts  →  lib/ibm/granite.ts
FORBIDDEN: app/**/page.tsx     →  lib/ibm/granite.ts
FORBIDDEN: components/**       →  lib/ibm/**
```

---

## File Structure

```
apps/web/
├── app/
│   ├── layout.tsx                   Root HTML shell + metadata
│   ├── page.tsx                     Landing page
│   ├── not-found.tsx                Global 404
│   ├── error.tsx                    Global error boundary
│   ├── (app)/                       Protected application pages
│   │   ├── profile/setup/page.tsx   Onboarding step 1
│   │   ├── interview/setup/page.tsx Onboarding step 2
│   │   ├── interview/session/       Live interview (future)
│   │   └── interview/report/        Post-interview report (future)
│   └── api/                         BFF API routes
│       ├── ibm/health/route.ts      IBM connectivity check
│       ├── interview/start/route.ts Start session via Orchestrate
│       ├── interview/message/       Send message via Orchestrate
│       ├── interview/end/           End session + generate report
│       ├── profile/route.ts         CRUD candidate profile
│       └── resume/upload/           PDF upload + text extraction
├── components/
│   ├── ui/                          Design system primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── Progress.tsx
│   ├── layout/
│   │   ├── SiteHeader.tsx
│   │   └── SiteFooter.tsx
│   ├── profile/
│   │   └── ProfileSetupForm.tsx
│   └── interview/
│       └── InterviewSetupForm.tsx
├── lib/
│   ├── ibm/                         SERVER-SIDE IBM clients
│   │   ├── iam.ts                   Token acquisition + caching
│   │   ├── granite.ts               watsonx.ai client
│   │   └── orchestrate.ts           Orchestrate agent client
│   ├── api/
│   │   └── client.ts                Typed frontend fetch wrappers
│   ├── store/
│   │   ├── profile.store.ts         Zustand profile state
│   │   └── interview.store.ts       Zustand interview state
│   ├── utils/
│   │   └── index.ts                 Pure utility functions
│   └── validators/
│       └── schemas.ts               Zod schemas
├── config/
│   ├── app.config.ts                Public app configuration
│   └── ibm.config.ts                IBM credentials (server-only)
├── types/
│   ├── domain.types.ts              Core business types
│   ├── api.types.ts                 API contract types
│   └── index.ts
└── styles/
    └── globals.css                  Tailwind base + design tokens
```

---

## State Management

| Store | Persisted | Contents |
|---|---|---|
| `useProfileStore` | Yes (localStorage) | Candidate profile, resume metadata |
| `useInterviewStore` | No (session only) | Active session, messages, report |

Zustand with `persist` middleware is used. Only non-sensitive display data is persisted — no IBM tokens, session IDs, or credentials ever reach localStorage.

---

## Design System

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `brand-600` | `#4f46e5` | Primary actions, links, highlights |
| `accent-500` | `#f59e0b` | Achievement indicators, warnings |
| `surface` | `#ffffff` | Page background |
| `surface-muted` | `#f8f9fc` | Section backgrounds |
| `surface-border` | `#e4e7f0` | Borders, dividers |
| `ink` | `#0f1117` | Primary text |
| `ink-muted` | `#4a5568` | Secondary text |

### Typography

- Font: Inter (system fallback chain)
- Scale: `heading-display` → `heading-1` → `heading-2` → `heading-3` → `heading-4` → `body-lg` → `body-base` → `body-sm` → `label` → `caption`

### Component Variants

All components use `class-variance-authority` for variant composition. Base styling is in `globals.css` as `@layer components`, consumed by Tailwind utilities.

---

## Security

- IBM credentials in `serverRuntimeConfig` (Next.js) — never in `publicRuntimeConfig`
- IAM token cached server-side per process, refreshed 5 minutes before expiry
- Security headers set globally via `next.config.js`
- Resume upload: server-side only, MIME type validated before PDF parsing
- No secrets in Zustand stores or localStorage
