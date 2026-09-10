// ============================================================
// InterviewIQ — Profile Analysis Page
// Shows extracted profile + skill match + interview plan
// ============================================================

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, MinusCircle, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { useAnalysisStore } from "@/lib/store/analysis.store";
import { ROUTES } from "@/config/app.config";
import { cn } from "@/lib/utils";

export default function ProfileAnalysisPage() {
  const router = useRouter();
  const { profile, jobAnalysis, skillMatch, interviewPlan, targetRole } = useAnalysisStore();

  if (!profile || !skillMatch || !jobAnalysis) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-muted">
        <div className="card max-w-sm p-8 text-center">
          <p className="body-base mb-4">No analysis found. Please upload your resume first.</p>
          <Button asChild>
            <a href={ROUTES.profileSetup}>Go to profile setup</a>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-muted py-12">
      <div className="container-narrow">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-ink-subtle">
            <span className="font-medium text-brand-600">Step 2</span>
            <span>of 3</span>
          </div>
          <h1 className="heading-2 mb-1">Your profile analysis</h1>
          <p className="body-base">
            IBM Granite has analysed your resume against the <strong>{targetRole}</strong> role.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Match score */}
          <div className="card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="heading-3">Role match</h2>
                <p className="body-sm mt-0.5">{skillMatch.matchSummary}</p>
              </div>
              <div className={cn(
                "flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold",
                skillMatch.matchScore >= 70 ? "bg-success-50 text-success-700" :
                skillMatch.matchScore >= 45 ? "bg-warning-50 text-warning-700" :
                "bg-danger-50 text-danger-700"
              )}>
                {skillMatch.matchScore}%
              </div>
            </div>
            <Progress value={skillMatch.matchScore} />
          </div>

          {/* Extracted profile summary */}
          <div className="card p-6">
            <h2 className="heading-3 mb-4">Extracted from resume</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {profile.name && (
                <div>
                  <p className="caption">Name</p>
                  <p className="text-sm font-medium">{profile.name}</p>
                </div>
              )}
              {profile.currentRole && (
                <div>
                  <p className="caption">Current role</p>
                  <p className="text-sm font-medium">{profile.currentRole}</p>
                </div>
              )}
              {profile.currentCompany && (
                <div>
                  <p className="caption">Company</p>
                  <p className="text-sm font-medium">{profile.currentCompany}</p>
                </div>
              )}
              {profile.yearsOfExperience !== undefined && profile.yearsOfExperience !== null && (
                <div>
                  <p className="caption">Experience</p>
                  <p className="text-sm font-medium">{profile.yearsOfExperience} years</p>
                </div>
              )}
            </div>
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-4">
                <p className="caption mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.slice(0, 20).map((skill) => (
                    <Badge key={skill} variant="default">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skill gap */}
          <div className="card p-6">
            <h2 className="heading-3 mb-4">Skill gap analysis</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success-500" />
                  <span className="text-sm font-medium text-success-700">Matched ({skillMatch.matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skillMatch.matchedSkills.map((s) => (
                    <Badge key={s} variant="success">{s}</Badge>
                  ))}
                  {skillMatch.matchedSkills.length === 0 && <p className="caption">None identified</p>}
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <MinusCircle className="h-4 w-4 text-warning-500" />
                  <span className="text-sm font-medium text-warning-700">Partial ({skillMatch.partiallyMatchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skillMatch.partiallyMatchedSkills.map((s) => (
                    <Badge key={s} variant="warning">{s}</Badge>
                  ))}
                  {skillMatch.partiallyMatchedSkills.length === 0 && <p className="caption">None</p>}
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-danger-500" />
                  <span className="text-sm font-medium text-danger-700">Missing ({skillMatch.missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skillMatch.missingSkills.map((s) => (
                    <Badge key={s} variant="danger">{s}</Badge>
                  ))}
                  {skillMatch.missingSkills.length === 0 && <p className="caption">None</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Preparation priorities */}
          {skillMatch.preparationPriorities && skillMatch.preparationPriorities.length > 0 && (
            <div className="card p-6">
              <h2 className="heading-3 mb-3">Preparation priorities</h2>
              <ol className="flex flex-col gap-2">
                {skillMatch.preparationPriorities.map((priority, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                      {i + 1}
                    </span>
                    <span className="body-sm pt-0.5">{priority}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Interview plan summary */}
          {interviewPlan && (
            <div className="card p-6">
              <h2 className="heading-3 mb-4">Interview plan</h2>
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(interviewPlan.distribution).map(([type, count]) => (
                  <div key={type} className="card-muted rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-brand-600">{count}</p>
                    <p className="caption capitalize">{type.replace("_", " ")}</p>
                  </div>
                ))}
              </div>
              {interviewPlan.focusAreas && interviewPlan.focusAreas.length > 0 && (
                <div>
                  <p className="caption mb-2">Focus areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {interviewPlan.focusAreas.map((area) => (
                      <Badge key={area} variant="brand">{area}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={() => router.push(ROUTES.interviewSetup)}
            >
              Continue to interview setup
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
