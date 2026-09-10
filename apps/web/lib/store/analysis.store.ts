// ============================================================
// InterviewIQ — Analysis Store (Zustand)
// Persists Granite analysis results across the app flow
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ExtractedProfile, JobAnalysis, SkillMatchResult, InterviewPlanResult } from "@/lib/ibm/granite";

export interface ResumeState {
  fileName: string;
  extractedText: string;
  uploadedAt: string;
}

interface AnalysisStoreState {
  resume: ResumeState | null;
  profile: ExtractedProfile | null;
  jobAnalysis: JobAnalysis | null;
  skillMatch: SkillMatchResult | null;
  interviewPlan: InterviewPlanResult | null;
  targetRole: string;
  jobDescriptionText: string;
  isAnalyzing: boolean;
  error: string | null;

  setResume: (resume: ResumeState) => void;
  setAnalysisResults: (data: {
    profile: ExtractedProfile;
    jobAnalysis: JobAnalysis;
    skillMatch: SkillMatchResult;
    interviewPlan: InterviewPlanResult;
  }) => void;
  setTargetRole: (role: string) => void;
  setJobDescription: (jd: string) => void;
  setAnalyzing: (v: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStoreState>()(
  persist(
    (set) => ({
      resume: null,
      profile: null,
      jobAnalysis: null,
      skillMatch: null,
      interviewPlan: null,
      targetRole: "",
      jobDescriptionText: "",
      isAnalyzing: false,
      error: null,

      setResume: (resume) => set({ resume }),
      setAnalysisResults: (data) =>
        set({
          profile: data.profile,
          jobAnalysis: data.jobAnalysis,
          skillMatch: data.skillMatch,
          interviewPlan: data.interviewPlan,
          error: null,
        }),
      setTargetRole: (targetRole) => set({ targetRole }),
      setJobDescription: (jobDescriptionText) => set({ jobDescriptionText }),
      setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          resume: null,
          profile: null,
          jobAnalysis: null,
          skillMatch: null,
          interviewPlan: null,
          error: null,
        }),
    }),
    {
      name: "interviewiq-analysis",
      // Persist everything except large text blobs
      partialize: (state) => ({
        profile: state.profile,
        jobAnalysis: state.jobAnalysis,
        skillMatch: state.skillMatch,
        interviewPlan: state.interviewPlan,
        targetRole: state.targetRole,
      }),
    },
  ),
);
