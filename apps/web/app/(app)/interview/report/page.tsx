// ============================================================
// InterviewIQ — Interview Report Page
// ============================================================

"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, TrendingUp, BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { useInterviewStore } from "@/lib/store/interview.store";
import { ROUTES } from "@/config/app.config";
import { cn } from "@/lib/utils";

function ScoreRing({ score, label }: { score: number; label: string }) {
  const colour =
    score >= 70 ? "text-success-700" : score >= 50 ? "text-warning-700" : score > 0 ? "text-danger-700" : "text-ink-subtle";
  const bg =
    score >= 70 ? "bg-success-50" : score >= 50 ? "bg-warning-50" : score > 0 ? "bg-danger-50" : "bg-surface-subtle";

  return (
    <div className={cn("flex flex-col items-center gap-1 rounded-xl p-4", bg)}>
      <span className={cn("text-2xl font-bold", colour)}>{score > 0 ? score : "—"}</span>
      <span className="caption text-center">{label}</span>
    </div>
  );
}

export default function ReportPage() {
  const { report, session, resetInterview } = useInterviewStore();

  if (!report) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-muted">
        <div className="card max-w-sm p-8 text-center">
          <p className="body-base mb-4">No report found.</p>
          <Button asChild>
            <Link href={ROUTES.profileSetup}>Start a new interview</Link>
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
          <h1 className="heading-2 mb-1">Interview report</h1>
          <p className="body-base">
            {session?.targetRole} — {new Date(report.generatedAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Score summary */}
          <div className="card p-6">
            <h2 className="heading-3 mb-4">Performance scores</h2>
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <span className="label">Overall score</span>
                <span className={cn(
                  "text-2xl font-bold",
                  report.overallScore >= 70 ? "text-success-700" :
                  report.overallScore >= 50 ? "text-warning-700" :
                  report.overallScore > 0 ? "text-danger-700" : "text-ink-subtle"
                )}>
                  {report.overallScore > 0 ? `${report.overallScore}/100` : "—"}
                </span>
              </div>
              {report.overallScore > 0 && <Progress value={report.overallScore} />}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <ScoreRing score={report.technicalScore} label="Technical" />
              <ScoreRing score={report.communicationScore} label="Communication" />
              <ScoreRing score={report.behavioralScore} label="Behavioral" />
            </div>
          </div>

          {/* Strengths & weaknesses */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-success-500" />
                <h2 className="heading-4">Strengths</h2>
              </div>
              {report.strengths.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {report.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                      <span className="mt-0.5 text-success-500">•</span>{s}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="body-sm">Insufficient data to identify strengths.</p>
              )}
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-5 w-5 text-danger-500" />
                <h2 className="heading-4">Areas to improve</h2>
              </div>
              {report.weaknesses.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {report.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                      <span className="mt-0.5 text-danger-500">•</span>{w}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="body-sm">No specific weaknesses identified.</p>
              )}
            </div>
          </div>

          {/* Skill gaps */}
          {report.skillGaps && report.skillGaps.length > 0 && (
            <div className="card p-6">
              <h2 className="heading-3 mb-3">Skill gaps</h2>
              <div className="flex flex-wrap gap-2">
                {report.skillGaps.map((gap) => (
                  <Badge key={gap} variant="danger">{gap}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Question observations */}
          {report.questionObservations && report.questionObservations.length > 0 && (
            <div className="card p-6">
              <h2 className="heading-3 mb-4">Question-by-question feedback</h2>
              <div className="flex flex-col gap-4">
                {report.questionObservations.map((obs, i) => (
                  <div key={i} className="rounded-lg border border-surface-border p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm font-medium text-ink">{obs.question}</p>
                      <span className={cn(
                        "flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                        obs.score >= 7 ? "bg-success-50 text-success-700" :
                        obs.score >= 5 ? "bg-warning-50 text-warning-700" :
                        obs.score > 0 ? "bg-danger-50 text-danger-700" : "bg-surface-subtle text-ink-subtle"
                      )}>
                        {obs.score > 0 ? `${obs.score}/10` : "—"}
                      </span>
                    </div>
                    <p className="body-sm">{obs.observation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {report.improvementRecommendations && report.improvementRecommendations.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-brand-600" />
                <h2 className="heading-3">Improvement recommendations</h2>
              </div>
              <ol className="flex flex-col gap-2">
                {report.improvementRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="body-sm">{rec}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Learning roadmap */}
          {report.learningRoadmap && report.learningRoadmap.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-brand-600" />
                <h2 className="heading-3">Learning roadmap</h2>
              </div>
              <div className="flex flex-col gap-3">
                {report.learningRoadmap.map((item, i) => (
                  <div key={i} className="rounded-lg border border-surface-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-ink">{item.skill}</span>
                      <Badge variant={
                        item.priority === "high" ? "danger" :
                        item.priority === "medium" ? "warning" : "default"
                      }>
                        {item.priority}
                      </Badge>
                      {item.estimatedWeeks > 0 && (
                        <span className="caption ml-auto">{item.estimatedWeeks}w</span>
                      )}
                    </div>
                    {item.resources && item.resources.length > 0 && (
                      <ul className="flex flex-col gap-1">
                        {item.resources.map((r, j) => (
                          <li key={j} className="text-xs text-ink-muted">• {r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                resetInterview();
                window.location.href = ROUTES.profileSetup;
              }}
            >
              <RotateCcw className="h-4 w-4" />
              New interview
            </Button>
            <Button className="flex-1" asChild>
              <Link href={ROUTES.profileAnalysis}>
                Review analysis
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
