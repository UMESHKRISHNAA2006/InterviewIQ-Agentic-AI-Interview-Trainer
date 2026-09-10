// ============================================================
// InterviewIQ — Core Domain Types
// ============================================================

// ── Candidate Profile ─────────────────────────────────────────────────────────

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  targetRole: string;
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  yearsOfExperience?: number;
  currentRole?: string;
  currentCompany?: string;
  education?: Education[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear?: number;
}

// ── Resume ────────────────────────────────────────────────────────────────────

export interface ResumeUpload {
  id: string;
  candidateId: string;
  fileName: string;
  fileSizeBytes: number;
  uploadedAt: string;
  /** Extracted plain text content from the PDF */
  extractedText?: string;
  /** Structured profile extracted by Granite */
  extractedProfile?: Partial<CandidateProfile>;
  status: "pending" | "processing" | "ready" | "error";
}

// ── Job Description ───────────────────────────────────────────────────────────

export interface JobDescription {
  id: string;
  title: string;
  company?: string;
  rawText: string;
  /** Structured requirements extracted by Granite */
  requirements?: JobRequirements;
}

export interface JobRequirements {
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  qualifications: string[];
  experienceRequired?: string;
}

// ── Skill Gap Analysis ────────────────────────────────────────────────────────

export interface SkillGapAnalysis {
  matchedSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  overallMatchScore: number; // 0–100
}

// ── Interview Session ─────────────────────────────────────────────────────────

export type InterviewStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "abandoned";

export type QuestionCategory =
  | "technical"
  | "behavioural"
  | "situational"
  | "role_specific"
  | "company_fit";

export interface InterviewSession {
  id: string;
  candidateId: string;
  targetRole: string;
  jobDescriptionId?: string;
  status: InterviewStatus;
  /** Orchestrate agent conversation/thread ID */
  orchestrateThreadId?: string;
  questions: InterviewQuestion[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  sessionId: string;
  order: number;
  category: QuestionCategory;
  questionText: string;
  answer?: CandidateAnswer;
  feedback?: AnswerFeedback;
}

// ── Answer & Evaluation ───────────────────────────────────────────────────────

export interface CandidateAnswer {
  id: string;
  questionId: string;
  text: string;
  submittedAt: string;
}

export interface AnswerFeedback {
  questionId: string;
  score: number; // 0–10
  strengths: string[];
  improvements: string[];
  modelAnswer?: string;
  evaluatedAt: string;
}

// ── Interview Report ──────────────────────────────────────────────────────────

export interface InterviewReport {
  id: string;
  sessionId: string;
  candidateId: string;
  overallScore: number; // 0–100
  categoryScores: Record<QuestionCategory, number>;
  skillGap: SkillGapAnalysis;
  strengths: string[];
  areasForImprovement: string[];
  improvementRoadmap: RoadmapItem[];
  generatedAt: string;
}

export interface RoadmapItem {
  skill: string;
  priority: "high" | "medium" | "low";
  suggestedResources: string[];
  estimatedTimeWeeks: number;
}

// ── Chat / Conversation ───────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system";

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
