// ============================================================
// InterviewIQ — API Contract Types
// Request/response shapes for all BFF API routes.
// ============================================================

import type {
  CandidateProfile,
  InterviewSession,
  InterviewReport,
  ConversationMessage,
  SkillGapAnalysis,
} from "./domain.types";

// ── Generic API Response Envelope ────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Profile API ───────────────────────────────────────────────────────────────

export interface CreateProfileRequest {
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  targetRole: string;
  experienceLevel: CandidateProfile["experienceLevel"];
  yearsOfExperience?: number;
  currentRole?: string;
  currentCompany?: string;
  skills?: string[];
}

export type CreateProfileResponse = ApiResponse<CandidateProfile>;
export type GetProfileResponse = ApiResponse<CandidateProfile>;

// ── Resume API ────────────────────────────────────────────────────────────────

export interface ResumeUploadResponse {
  resumeId: string;
  extractedProfile: Partial<CandidateProfile>;
  skillGapPreview?: SkillGapAnalysis;
}

// ── Interview API ─────────────────────────────────────────────────────────────

export interface StartInterviewRequest {
  candidateId: string;
  targetRole: string;
  jobDescriptionText?: string;
  questionCount?: number;
}

export interface StartInterviewResponse {
  session: InterviewSession;
  firstMessage: ConversationMessage;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
}

export interface SendMessageResponse {
  message: ConversationMessage;
  /** Populated when the session transitions to "completed" */
  sessionComplete?: boolean;
}

export interface EndInterviewRequest {
  sessionId: string;
}

export interface EndInterviewResponse {
  report: InterviewReport;
}

// ── IBM Health API ─────────────────────────────────────────────────────────────

export interface IbmHealthStatus {
  watsonxAi: "connected" | "unconfigured" | "error";
  orchestrate: "connected" | "unconfigured" | "error";
  timestamp: string;
}

export type IbmHealthResponse = ApiResponse<IbmHealthStatus>;
