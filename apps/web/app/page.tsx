// ============================================================
// InterviewIQ — Landing Page
// ============================================================

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Target,
  MessageSquare,
  BarChart3,
  CheckCircle2,
  Sparkles,
  BrainCircuit,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ROUTES } from "@/config/app.config";

// ── Illustration: Interview Scene ─────────────────────────────────────────────
// A purposeful SVG editorial illustration — not stock imagery.
function InterviewIllustration() {
  return (
    <svg
      viewBox="0 0 480 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full max-w-lg"
    >
      {/* Background desk surface */}
      <rect x="40" y="280" width="400" height="12" rx="6" fill="#e4e7f0" />

      {/* Monitor */}
      <rect x="160" y="120" width="160" height="110" rx="8" fill="#1e1b4b" />
      <rect x="168" y="128" width="144" height="94" rx="4" fill="#312e81" />

      {/* Screen content — interview chat bubbles */}
      <rect x="176" y="136" width="80" height="10" rx="5" fill="#6366f1" opacity="0.8" />
      <rect x="176" y="152" width="60" height="8" rx="4" fill="#4f46e5" opacity="0.6" />
      <rect x="196" y="166" width="80" height="10" rx="5" fill="#818cf8" opacity="0.7" />
      <rect x="196" y="182" width="55" height="8" rx="4" fill="#818cf8" opacity="0.4" />
      <rect x="176" y="196" width="70" height="10" rx="5" fill="#6366f1" opacity="0.8" />

      {/* Monitor stand */}
      <rect x="228" y="230" width="24" height="20" rx="3" fill="#c7d6fe" />
      <rect x="210" y="248" width="60" height="8" rx="4" fill="#a5b8fc" />

      {/* Candidate — left side */}
      {/* Body */}
      <rect x="60" y="200" width="60" height="80" rx="12" fill="#e0e9ff" />
      {/* Head */}
      <circle cx="90" cy="180" r="24" fill="#fde68a" />
      {/* Hair */}
      <path d="M66 174 Q90 154 114 174" fill="#0f1117" />
      {/* Eyes */}
      <circle cx="82" cy="178" r="3" fill="#0f1117" />
      <circle cx="98" cy="178" r="3" fill="#0f1117" />
      {/* Smile */}
      <path d="M82 188 Q90 195 98 188" stroke="#0f1117" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Collar / tie */}
      <path d="M78 204 L90 218 L102 204" fill="#4f46e5" />
      {/* Arms */}
      <rect x="42" y="205" width="18" height="40" rx="9" fill="#e0e9ff" />
      <rect x="120" y="205" width="18" height="40" rx="9" fill="#e0e9ff" />
      {/* Laptop in front */}
      <rect x="52" y="242" width="76" height="48" rx="6" fill="#f1f3f9" />
      <rect x="58" y="248" width="64" height="36" rx="3" fill="#312e81" />
      <rect x="62" y="252" width="56" height="6" rx="3" fill="#6366f1" opacity="0.7" />
      <rect x="62" y="262" width="40" height="4" rx="2" fill="#818cf8" opacity="0.5" />
      <rect x="62" y="270" width="50" height="4" rx="2" fill="#818cf8" opacity="0.5" />
      <rect x="48" y="288" width="84" height="6" rx="3" fill="#c7d6fe" />

      {/* Interviewer — right side */}
      {/* Body */}
      <rect x="360" y="200" width="60" height="80" rx="12" fill="#f1f3f9" />
      {/* Head */}
      <circle cx="390" cy="180" r="24" fill="#fcd34d" />
      {/* Hair */}
      <path d="M366 170 Q390 152 414 170 L414 164 Q390 144 366 164Z" fill="#78350f" />
      {/* Eyes */}
      <circle cx="382" cy="178" r="3" fill="#0f1117" />
      <circle cx="398" cy="178" r="3" fill="#0f1117" />
      {/* Glasses */}
      <rect x="376" y="173" width="12" height="9" rx="4" stroke="#4a5568" strokeWidth="1.5" fill="none" />
      <rect x="392" y="173" width="12" height="9" rx="4" stroke="#4a5568" strokeWidth="1.5" fill="none" />
      <line x1="388" y1="177" x2="392" y2="177" stroke="#4a5568" strokeWidth="1.5" />
      {/* Neutral expression */}
      <path d="M384 188 Q390 191 396 188" stroke="#0f1117" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Collar */}
      <path d="M378 204 L390 216 L402 204" fill="#1e1b4b" />
      {/* Arms */}
      <rect x="342" y="205" width="18" height="40" rx="9" fill="#f1f3f9" />
      <rect x="420" y="205" width="18" height="40" rx="9" fill="#f1f3f9" />
      {/* Notepad */}
      <rect x="352" y="246" width="56" height="46" rx="5" fill="#fffbeb" />
      <rect x="358" y="256" width="44" height="4" rx="2" fill="#fde68a" />
      <rect x="358" y="264" width="38" height="3" rx="1.5" fill="#fde68a" opacity="0.6" />
      <rect x="358" y="271" width="42" height="3" rx="1.5" fill="#fde68a" opacity="0.6" />
      <rect x="358" y="278" width="30" height="3" rx="1.5" fill="#fde68a" opacity="0.6" />

      {/* Speech bubble from interviewer */}
      <rect x="280" y="100" width="130" height="48" rx="10" fill="#f0f4ff" stroke="#c7d6fe" strokeWidth="1.5" />
      <polygon points="320,148 330,165 340,148" fill="#f0f4ff" stroke="#c7d6fe" strokeWidth="1.5" />
      <rect x="292" y="112" width="90" height="6" rx="3" fill="#6366f1" opacity="0.6" />
      <rect x="292" y="124" width="70" height="5" rx="2.5" fill="#4f46e5" opacity="0.4" />
      <rect x="292" y="134" width="80" height="5" rx="2.5" fill="#4f46e5" opacity="0.3" />

      {/* Speech bubble from candidate */}
      <rect x="70" y="72" width="130" height="48" rx="10" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5" />
      <polygon points="140,120 150,137 160,120" fill="#fffbeb" stroke="#fde68a" strokeWidth="1.5" />
      <rect x="82" y="84" width="100" height="6" rx="3" fill="#d97706" opacity="0.6" />
      <rect x="82" y="96" width="80" height="5" rx="2.5" fill="#f59e0b" opacity="0.4" />
      <rect x="82" y="106" width="90" height="5" rx="2.5" fill="#f59e0b" opacity="0.3" />

      {/* AI indicator chip — top center */}
      <rect x="198" y="56" width="84" height="24" rx="12" fill="#4f46e5" />
      <circle cx="214" cy="68" r="5" fill="#818cf8" />
      <rect x="224" y="64" width="48" height="4" rx="2" fill="white" opacity="0.9" />
      <rect x="224" y="71" width="32" height="3" rx="1.5" fill="white" opacity="0.6" />

      {/* Connecting lines (AI analysis) */}
      <line x1="240" y1="80" x2="240" y2="120" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
    </svg>
  );
}

// ── How it works steps ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: FileText,
    title: "Build your profile",
    description:
      "Upload your resume and set your target role. InterviewIQ reads your background and understands where you are.",
  },
  {
    step: "02",
    icon: Target,
    title: "Set your target",
    description:
      "Paste an optional job description. The AI maps your skills to the role's requirements and identifies gaps.",
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Interview with AI",
    description:
      "An adaptive interview session driven by IBM watsonx Orchestrate. Questions adjust to your answers in real time.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Get your report",
    description:
      "Detailed performance analysis, skill gap identification, and a personalised improvement roadmap.",
  },
];

// ── Key features ──────────────────────────────────────────────────────────────
const FEATURES = [
  "Personalised questions based on your actual resume",
  "Live skill-gap analysis against your target role",
  "Adaptive difficulty — harder as you improve",
  "Per-answer feedback with model answers",
  "Behavioural, technical, and situational questions",
  "Improvement roadmap with curated resources",
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b border-surface-border bg-surface py-20 sm:py-28">
          {/* Subtle grid pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="container-page relative">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* Left — copy */}
              <div className="flex flex-col gap-6">
                <Badge variant="brand" className="w-fit">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Powered by IBM watsonx
                </Badge>

                <h1 className="heading-display">
                  Ace your next
                  <br />
                  <span className="text-brand-600">interview</span>
                  <br />
                  with AI coaching
                </h1>

                <p className="body-lg max-w-md">
                  InterviewIQ prepares you with personalised, role-specific mock
                  interviews — analysing your resume, matching it to the job, and
                  training you with adaptive questions.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button size="lg" asChild>
                    <Link href={ROUTES.profileSetup} prefetch={false}>
                        Start training free
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="lg" asChild>
                    <Link href="#how-it-works">See how it works</Link>
                  </Button>
                </div>

                <p className="caption">
                  No account required to try · Built on IBM watsonx AI
                </p>
              </div>

              {/* Right — illustration */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Soft background ring */}
                  <div
                    className="absolute inset-0 -m-8 rounded-full bg-brand-50 opacity-60"
                    aria-hidden="true"
                  />
                  <InterviewIllustration />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Social proof strip ───────────────────────────────────────────── */}
        <section className="border-b border-surface-border bg-surface-muted py-6">
          <div className="container-page">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <p className="caption font-medium uppercase tracking-widest">
                Powered by
              </p>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-brand-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-ink">
                  IBM watsonx.ai
                </span>
              </div>
              <div className="h-4 w-px bg-surface-border" aria-hidden="true" />
              <span className="text-sm font-semibold text-ink">
                IBM watsonx Orchestrate
              </span>
              <div className="h-4 w-px bg-surface-border" aria-hidden="true" />
              <span className="text-sm font-semibold text-ink">
                Granite 4.0 H-Small
              </span>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="border-b border-surface-border py-20 sm:py-28"
        >
          <div className="container-page">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <Badge variant="outline" className="mb-4">
                Process
              </Badge>
              <h2 className="heading-1 mb-4">
                From resume to interview-ready
                <br />
                in four steps
              </h2>
              <p className="body-lg">
                InterviewIQ doesn&apos;t just quiz you — it understands your
                background, maps it to your target role, and trains you where it
                matters most.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="card group relative flex flex-col gap-4 p-6 transition-shadow hover:shadow-lift"
                  >
                    {/* Step number — large background text */}
                    <span
                      className="absolute right-4 top-3 text-6xl font-black text-surface-subtle select-none"
                      aria-hidden="true"
                    >
                      {item.step}
                    </span>

                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
                      <Icon
                        className="h-5 w-5 text-brand-600"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h3 className="heading-4">{item.title}</h3>
                      <p className="body-sm">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section id="features" className="bg-surface-muted py-20 sm:py-28">
          <div className="container-page">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* Left */}
              <div className="flex flex-col gap-6">
                <Badge variant="outline">Features</Badge>
                <h2 className="heading-1">
                  Everything you need to
                  <br />
                  prepare with confidence
                </h2>
                <ul className="flex flex-col gap-3">
                  {FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-500"
                        aria-hidden="true"
                      />
                      <span className="body-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — stat cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    value: "Adaptive",
                    label: "Interview questions",
                    desc: "Adjusts to your level",
                  },
                  {
                    value: "Real-time",
                    label: "AI feedback",
                    desc: "On every answer",
                  },
                  {
                    value: "Skill gap",
                    label: "Analysis",
                    desc: "Resume vs job description",
                  },
                  {
                    value: "Roadmap",
                    label: "Improvement plan",
                    desc: "Personalised to you",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="card p-5">
                    <p className="text-xl font-bold text-brand-600">
                      {stat.value}
                    </p>
                    <p className="label mt-0.5">{stat.label}</p>
                    <p className="caption mt-1">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section className="border-t border-surface-border py-20 sm:py-28">
          <div className="container-narrow text-center">
            <h2 className="heading-1 mb-4">
              Your next interview starts here
            </h2>
            <p className="body-lg mb-8">
              Set up your profile in under 2 minutes. No credit card required.
            </p>
            <Button size="xl" asChild>
              <Link href={ROUTES.profileSetup}>
                Build my interview profile
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
