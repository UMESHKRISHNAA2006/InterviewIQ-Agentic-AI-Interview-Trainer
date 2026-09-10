// ============================================================
// InterviewIQ — Application Configuration
// All non-secret, runtime-safe configuration constants.
// ============================================================

export const APP_CONFIG = {
  name: "InterviewIQ",
  tagline: "Agentic AI Interview Trainer",
  description:
    "Prepare for your dream role with AI-powered, personalised interview coaching.",
  version: "0.1.0",

  // Public URLs
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  env: (process.env.NEXT_PUBLIC_APP_ENV || "development") as
    | "development"
    | "staging"
    | "production",
} as const;

// ── Resume upload constraints ─────────────────────────────────────────────────
export const RESUME_CONFIG = {
  maxSizeMb: 5,
  maxSizeBytes: 5 * 1024 * 1024,
  allowedMimeTypes: ["application/pdf"],
  allowedExtensions: [".pdf"],
} as const;

// ── Interview session constraints ─────────────────────────────────────────────
export const INTERVIEW_CONFIG = {
  minQuestions: 5,
  maxQuestions: 20,
  defaultQuestions: 10,
  answerMinChars: 20,
  answerMaxChars: 2000,
  sessionTimeoutMinutes: 60,
} as const;

// ── Navigation ────────────────────────────────────────────────────────────────
export const ROUTES = {
  home: "/",
  // Auth (future)
  login: "/login",
  register: "/register",
  // App
  dashboard: "/dashboard",
  profile: "/profile",
  profileSetup: "/profile/setup",
  profileAnalysis: "/profile/analysis",
  interviewSetup: "/interview/setup",
  interviewSession: "/interview/session",
  interviewReport: "/interview/report",
  // API (BFF)
  api: {
    profile: "/api/profile",
    analyze: "/api/analyze",
    interview: {
      start: "/api/interview/start",
      message: "/api/interview/message",
      end: "/api/interview/end",
    },
    resume: {
      upload: "/api/resume/upload",
    },
    ibm: {
      health: "/api/ibm/health",
    },
  },
} as const;

// ── Job role suggestions (seeded for profile form) ────────────────────────────
export const SUGGESTED_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Architect",
  "Product Manager",
  "UX Designer",
  "Data Analyst",
  "Cybersecurity Analyst",
  "Mobile Developer",
  "QA Engineer",
  "Site Reliability Engineer",
] as const;

// ── Experience levels ─────────────────────────────────────────────────────────
export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level (0–2 years)" },
  { value: "mid", label: "Mid Level (2–5 years)" },
  { value: "senior", label: "Senior Level (5–10 years)" },
  { value: "lead", label: "Lead / Principal (10+ years)" },
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]["value"];
