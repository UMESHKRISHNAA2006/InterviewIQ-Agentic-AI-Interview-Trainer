// ============================================================
// InterviewIQ — Interview Session Store (Zustand)
// Carries full state through the interview flow
// ============================================================

import { create } from "zustand";
import type { ConversationMessage } from "@/types/domain.types";
import type {
  ExtractedProfile,
  JobAnalysis,
  SkillMatchResult,
  InterviewPlanResult,
} from "@/lib/ibm/granite";

export interface InterviewStateData {
  sessionId: string;
  candidateId: string;
  targetRole: string;
  systemContext: string;
  status: "not_started" | "in_progress" | "completed" | "abandoned";
  questionCount: number;
  currentQuestionNumber: number;
  startedAt: string;
  completedAt?: string;
  // Analysis data from Granite (carried into interview)
  extractedProfile?: ExtractedProfile;
  jobAnalysis?: JobAnalysis;
  skillMatch?: SkillMatchResult;
  interviewPlan?: InterviewPlanResult;
}

export interface InterviewReport {
  id: string;
  sessionId: string;
  candidateId: string;
  targetRole: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  behavioralScore: number;
  strengths: string[];
  weaknesses: string[];
  questionObservations: Array<{ question: string; observation: string; score: number }>;
  skillGaps: string[];
  improvementRecommendations: string[];
  learningRoadmap: Array<{
    skill: string;
    priority: "high" | "medium" | "low";
    resources: string[];
    estimatedWeeks: number;
  }>;
  generatedAt: string;
}

interface InterviewStoreState {
  session: InterviewStateData | null;
  messages: ConversationMessage[];
  report: InterviewReport | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  setSession: (session: InterviewStateData) => void;
  addMessage: (message: ConversationMessage) => void;
  setMessages: (messages: ConversationMessage[]) => void;
  setReport: (report: InterviewReport) => void;
  incrementQuestion: () => void;
  markComplete: () => void;
  setLoading: (loading: boolean) => void;
  setSending: (sending: boolean) => void;
  setError: (error: string | null) => void;
  resetInterview: () => void;
}

export const useInterviewStore = create<InterviewStoreState>()((set) => ({
  session: null,
  messages: [],
  report: null,
  isLoading: false,
  isSending: false,
  error: null,

  setSession: (session) => set({ session, error: null }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setReport: (report) => set({ report }),
  incrementQuestion: () =>
    set((state) => ({
      session: state.session
        ? { ...state.session, currentQuestionNumber: state.session.currentQuestionNumber + 1 }
        : null,
    })),
  markComplete: () =>
    set((state) => ({
      session: state.session
        ? { ...state.session, status: "completed", completedAt: new Date().toISOString() }
        : null,
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setSending: (isSending) => set({ isSending }),
  setError: (error) => set({ error }),
  resetInterview: () => set({ session: null, messages: [], report: null, error: null }),
}));
