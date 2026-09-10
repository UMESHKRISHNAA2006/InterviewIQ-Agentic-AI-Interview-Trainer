# InterviewIQ — Development Plan

## Current Status

**Phase 0 — Foundation ✅** (this deliverable)
- Project structure scaffolded
- TypeScript + Tailwind configured
- Design system tokens and base components built
- IBM integration interfaces created (placeholder mode)
- Landing page built
- Profile setup and interview setup pages built

---

## Phase 1 — Core Application Shell

**Goal:** Working end-to-end flow from profile → interview → placeholder report.

### Tasks

- [ ] **Profile page** — view/edit saved profile with resume upload zone
- [ ] **Resume upload** — `POST /api/resume/upload` → PDF → text extraction (pdf-parse)
- [ ] **Profile extraction** — Granite `extractProfileFromResume` → auto-fill profile fields
- [ ] **Interview session page** — chat-style UI, renders messages from Orchestrate
- [ ] **Answer input** — validated form, character counter, submit to `/api/interview/message`
- [ ] **Session completion** — detect `sessionComplete` flag → redirect to report
- [ ] **Report page** — renders `InterviewReport` data structure (scaffold)

**Deliverable:** Full flow works with placeholder IBM responses. UI is complete and usable.

---

## Phase 2 — IBM Integration

**Goal:** Replace all placeholders with live IBM calls.

### Prerequisites

- IBM_WATSONX_API_KEY supplied
- IBM_WATSONX_PROJECT_ID supplied
- IBM_ORCHESTRATE_API_KEY supplied
- IBM_ORCHESTRATE_AGENT_ID supplied
- Confirm Orchestrate REST API endpoint paths

### Tasks

- [ ] **Granite profile extraction** — live PDF → profile extraction
- [ ] **JD analysis** — live job description → requirements parsing
- [ ] **Skill-gap analysis** — live candidate vs JD scoring
- [ ] **Orchestrate interview** — live adaptive interview session
- [ ] **Orchestrate evaluation** — live answer scoring + feedback
- [ ] **Report generation** — parse Orchestrate summary into structured report
- [ ] Test all API routes end-to-end with real credentials

---

## Phase 3 — Report & Roadmap

**Goal:** Rich interview report with skill-gap visualisation and improvement roadmap.

### Tasks

- [ ] **Score visualisation** — category score bars, overall score ring
- [ ] **Skill gap display** — matched / missing / partial skill chips
- [ ] **Roadmap** — prioritised skill improvement items with resources
- [ ] **Answer review** — expandable per-question feedback
- [ ] **PDF export** — print-optimised report layout

---

## Phase 4 — Polish & Production

- [ ] Authentication (NextAuth.js or Clerk)
- [ ] Profile persistence (database — Supabase or Planetscale)
- [ ] Session history — past interviews and progress over time
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance — Lighthouse 90+
- [ ] Rate limiting on API routes
- [ ] Error monitoring (Sentry)
- [ ] Deployment (Vercel or IBM Code Engine)

---

## IBM Integration Boundaries

```
Feature                      │ Service           │ Phase
─────────────────────────────┼───────────────────┼────────
Resume → profile extraction  │ Granite 4.0       │ 2
JD → requirements parsing    │ Granite 4.0       │ 2
Skill-gap scoring            │ Granite 4.0       │ 2
Adaptive interview Q&A       │ Orchestrate Agent │ 2
Answer evaluation            │ Orchestrate Agent │ 2
Performance report           │ Orchestrate Agent │ 3
Improvement roadmap          │ Orchestrate Agent │ 3
```

---

## Not in Scope (per project brief)

- Voice input/output
- Video recording
- Multiple AI providers (only IBM)
- Real-time multiplayer sessions
