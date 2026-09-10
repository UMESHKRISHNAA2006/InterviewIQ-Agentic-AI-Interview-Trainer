// ============================================================
// InterviewIQ — Form & API Validators (Zod Schemas)
// ============================================================

import { z } from "zod";

// ── Profile ───────────────────────────────────────────────────────────────────

export const experienceLevelSchema = z.enum(["entry", "mid", "senior", "lead"]);

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  linkedinUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  targetRole: z
    .string()
    .min(2, "Target role is required")
    .max(100, "Role name is too long"),
  experienceLevel: experienceLevelSchema,
  yearsOfExperience: z
    .number()
    .min(0)
    .max(50)
    .optional(),
  currentRole: z.string().max(100).optional(),
  currentCompany: z.string().max(100).optional(),
  skills: z.array(z.string().max(50)).max(30).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// ── Interview Setup ───────────────────────────────────────────────────────────

export const interviewSetupSchema = z.object({
  targetRole: z
    .string()
    .min(2, "Target role is required")
    .max(100, "Role name is too long"),
  jobDescriptionText: z
    .string()
    .max(10000, "Job description is too long (max 10,000 characters)")
    .optional(),
  questionCount: z
    .number()
    .int()
    .min(5, "Minimum 5 questions")
    .max(20, "Maximum 20 questions")
    .default(10),
});

export type InterviewSetupFormValues = z.infer<typeof interviewSetupSchema>;

// ── Answer Submission ─────────────────────────────────────────────────────────

export const answerSchema = z.object({
  text: z
    .string()
    .min(20, "Please provide a more detailed answer (at least 20 characters)")
    .max(2000, "Answer is too long (max 2,000 characters)"),
});

export type AnswerFormValues = z.infer<typeof answerSchema>;

// ── API Request Validators (server-side) ──────────────────────────────────────

export const startInterviewRequestSchema = z.object({
  candidateId: z.string().min(1),
  targetRole: z.string().min(2).max(100),
  jobDescriptionText: z.string().max(10000).optional(),
  questionCount: z.number().int().min(5).max(20).optional(),
});

export const sendMessageRequestSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(2000),
});

export const endInterviewRequestSchema = z.object({
  sessionId: z.string().min(1),
});
