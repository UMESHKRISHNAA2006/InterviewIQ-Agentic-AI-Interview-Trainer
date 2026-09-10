// ============================================================
// InterviewIQ — Interview Setup Page
// Confirms settings then starts the Orchestrate interview
// ============================================================

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAnalysisStore } from "@/lib/store/analysis.store";
import { useInterviewStore } from "@/lib/store/interview.store";
import { ROUTES } from "@/config/app.config";
import { generateId } from "@/lib/utils";

export default function InterviewSetupPage() {
  const router = useRouter();
  const { profile, jobAnalysis, skillMatch, interviewPlan, targetRole, jobDescriptionText } = useAnalysisStore();
  const { setSession, addMessage, setError, setLoading, isLoading, error } = useInterviewStore();

  const [questionCount, setQuestionCount] = useState(interviewPlan?.totalQuestions ?? 10);

  const handleStart = async () => {
    if (!targetRole) {
      setError("Target role is missing. Please go back and set up your profile.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build candidate summary for the agent
      const candidateSummary = profile
        ? [
            profile.currentRole && `Current role: ${profile.currentRole}`,
            profile.yearsOfExperience && `${profile.yearsOfExperience} years experience`,
            profile.skills?.length && `Skills: ${profile.skills.slice(0, 10).join(", ")}`,
            skillMatch?.missingSkills?.length && `Gaps to probe: ${skillMatch.missingSkills.slice(0, 5).join(", ")}`,
          ]
            .filter(Boolean)
            .join(". ")
        : `Candidate for ${targetRole}`;

      const focusAreas = skillMatch?.preparationPriorities?.slice(0, 4) ??
        interviewPlan?.focusAreas?.slice(0, 4) ?? [];

      const res = await fetch(ROUTES.api.interview.start, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: generateId(),
          targetRole,
          candidateName: profile?.name,
          candidateSummary,
          jobDescriptionText: jobDescriptionText || undefined,
          interviewPlan: interviewPlan?.openingContext,
          questionCount,
          focusAreas,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message ?? "Failed to start interview.");
        return;
      }

      setSession({
        sessionId: data.data.sessionId,
        candidateId: "local",
        targetRole,
        systemContext: data.data.systemContext,
        status: "in_progress",
        questionCount,
        currentQuestionNumber: 1,
        startedAt: new Date().toISOString(),
        extractedProfile: profile ?? undefined,
        jobAnalysis: jobAnalysis ?? undefined,
        skillMatch: skillMatch ?? undefined,
        interviewPlan: interviewPlan ?? undefined,
      });

      addMessage(data.data.firstMessage);
      router.push(ROUTES.interviewSession);
    } catch {
      setError("Failed to start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const notReady = !profile && !targetRole;

  return (
    <main className="min-h-screen bg-surface-muted py-12">
      <div className="container-form">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-ink-subtle">
            <span className="font-medium text-brand-600">Step 3</span>
            <span>of 3</span>
          </div>
          <h1 className="heading-2 mb-1">Ready to interview?</h1>
          <p className="body-base">
            Review your setup before starting the live AI interview.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Summary card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600">
                <BrainCircuit className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="heading-4">{targetRole || "No role selected"}</p>
                <p className="caption">InterviewIQ Orchestrate Agent — Live interview</p>
              </div>
            </div>

            {skillMatch && (
              <div className="mb-4 flex items-center gap-2">
                <span className="caption">Match score:</span>
                <Badge variant={skillMatch.matchScore >= 70 ? "success" : skillMatch.matchScore >= 45 ? "warning" : "danger"}>
                  {skillMatch.matchScore}%
                </Badge>
              </div>
            )}

            {interviewPlan?.focusAreas && interviewPlan.focusAreas.length > 0 && (
              <div>
                <p className="caption mb-2">Focus areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {interviewPlan.focusAreas.map((a) => (
                    <Badge key={a} variant="brand">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Question count */}
          <div className="card p-6">
            <h2 className="heading-4 mb-3">Number of questions</h2>
            <div className="flex gap-2 flex-wrap">
              {[5, 8, 10, 12, 15].map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    questionCount === n
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-surface-border text-ink-muted hover:border-brand-300"
                  }`}
                >
                  {n}{n === 10 ? " ✓" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* What to expect */}
          <div className="card-muted rounded-xl p-5">
            <h3 className="heading-4 mb-2">What to expect</h3>
            <ul className="flex flex-col gap-1.5">
              {[
                "The interviewer will ask one question at a time",
                "Take your time to formulate a complete answer",
                "The interview adapts based on your responses",
                "After completion, you'll receive a detailed report",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-ink-muted">
                  <span className="mt-0.5 text-brand-600">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {notReady && (
            <div className="rounded-lg border border-warning-500/20 bg-warning-50 p-3 text-sm text-warning-700">
              Profile not found. <a href={ROUTES.profileSetup} className="font-medium underline">Set up your profile first.</a>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-danger-500/20 bg-danger-50 p-3 text-sm text-danger-700" role="alert">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.back()} disabled={isLoading}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={handleStart}
              isLoading={isLoading}
              disabled={notReady || isLoading}
            >
              {isLoading ? "Starting interview…" : (
                <>
                  Start interview
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
