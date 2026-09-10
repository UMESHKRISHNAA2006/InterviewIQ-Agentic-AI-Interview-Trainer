// ============================================================
// InterviewIQ — Profile Setup Page
// Handles: resume upload → role input → JD input → Granite analysis
// ============================================================

"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, X, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useAnalysisStore } from "@/lib/store/analysis.store";
import { ROUTES, SUGGESTED_ROLES, RESUME_CONFIG } from "@/config/app.config";

export default function ProfileSetupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    resume,
    targetRole,
    jobDescriptionText,
    isAnalyzing,
    error,
    setResume,
    setTargetRole,
    setJobDescription,
    setAnalysisResults,
    setAnalyzing,
    setError,
  } = useAnalysisStore();

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [jdValue, setJdValue] = useState(jobDescriptionText);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!["pdf", "txt"].includes(ext ?? "")) {
      setUploadError("Please upload a PDF or TXT file.");
      return;
    }
    if (file.size > RESUME_CONFIG.maxSizeBytes) {
      setUploadError(`File too large. Maximum size is ${RESUME_CONFIG.maxSizeMb}MB.`);
      return;
    }

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(ROUTES.api.resume.upload, { method: "POST", body: formData });
      const data = await res.json();

      if (!data.success) {
        setUploadError(data.error?.message ?? "Upload failed.");
        return;
      }

      setResume({
        fileName: data.data.fileName,
        extractedText: data.data.extractedText,
        uploadedAt: new Date().toISOString(),
      });
    } catch {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = async () => {
    if (!resume?.extractedText) {
      setError("Please upload your resume first.");
      return;
    }
    if (!targetRole.trim()) {
      setError("Please enter your target role.");
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch(ROUTES.api.analyze, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resume.extractedText,
          targetRole: targetRole.trim(),
          jobDescriptionText: jdValue.trim() || undefined,
          questionCount: 10,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message ?? "Analysis failed.");
        return;
      }

      setAnalysisResults(data.data);
      setJobDescription(jdValue);
      router.push(ROUTES.profileAnalysis);
    } catch {
      setError("Analysis failed. Please check your connection and try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-muted py-12">
      <div className="container-form">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-ink-subtle">
            <span className="font-medium text-brand-600">Step 1</span>
            <span>of 3</span>
          </div>
          <h1 className="heading-2 mb-1">Set up your profile</h1>
          <p className="body-base">Upload your resume and tell us what role you&apos;re targeting.</p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Resume upload */}
          <div className="card p-6">
            <h2 className="heading-4 mb-4">Resume</h2>

            {resume ? (
              <div className="flex items-center justify-between rounded-lg border border-surface-border bg-surface-subtle p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="text-sm font-medium text-ink">{resume.fileName}</p>
                    <p className="caption">{resume.extractedText.length.toLocaleString()} characters extracted</p>
                  </div>
                </div>
                <button
                  onClick={() => setResume({ fileName: "", extractedText: "", uploadedAt: "" })}
                  className="rounded p-1 text-ink-subtle hover:bg-surface-border hover:text-ink"
                  aria-label="Remove resume"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  uploadingFile
                    ? "border-brand-300 bg-brand-50"
                    : "border-surface-border hover:border-brand-300 hover:bg-brand-50"
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              >
                {uploadingFile ? (
                  <Loader2 className="mb-2 h-8 w-8 animate-spin text-brand-600" />
                ) : (
                  <Upload className="mb-2 h-8 w-8 text-ink-placeholder" />
                )}
                <p className="text-sm font-medium text-ink">
                  {uploadingFile ? "Uploading..." : "Drop your resume here or click to browse"}
                </p>
                <p className="caption mt-1">PDF or TXT, max {RESUME_CONFIG.maxSizeMb}MB</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
                e.target.value = "";
              }}
            />

            {uploadError && (
              <p className="mt-2 text-xs text-danger-500" role="alert">{uploadError}</p>
            )}
          </div>

          {/* Target role */}
          <div className="card p-6">
            <h2 className="heading-4 mb-4">Target role</h2>
            <Input
              label="Job title you are interviewing for"
              placeholder="e.g. Software Engineer"
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTED_ROLES.slice(0, 8).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setTargetRole(role)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    targetRole === role
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-surface-border text-ink-muted hover:border-brand-300 hover:text-brand-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Job description (optional) */}
          <div className="card p-6">
            <h2 className="heading-4 mb-1">Job description <span className="text-sm font-normal text-ink-subtle">(optional but recommended)</span></h2>
            <p className="body-sm mb-4">Paste the job posting to get personalised questions based on actual requirements.</p>
            <Textarea
              placeholder="Paste the job description here..."
              rows={6}
              value={jdValue}
              onChange={(e) => setJdValue(e.target.value)}
              showCharCount
              maxLength={10000}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-danger-500/20 bg-danger-50 p-3 text-sm text-danger-700" role="alert">
              {error}
            </div>
          )}

          {/* CTA */}
          <Button
            size="lg"
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            disabled={!resume?.extractedText || !targetRole.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              "Analysing with IBM Granite…"
            ) : (
              <>
                Analyse my profile
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
          {isAnalyzing && (
            <p className="caption text-center">
              Extracting your profile, analysing the role, and matching skills — this takes about 15–30 seconds.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
