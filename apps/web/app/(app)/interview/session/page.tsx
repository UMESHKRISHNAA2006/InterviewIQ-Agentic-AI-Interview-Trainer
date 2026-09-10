// ============================================================
// InterviewIQ — Interview Session Page
// Live adaptive interview via IBM watsonx Orchestrate
// ============================================================

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, Flag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useInterviewStore } from "@/lib/store/interview.store";
import { ROUTES } from "@/config/app.config";
import { cn } from "@/lib/utils";
import { ChatMessageContent } from "@/components/interview/ChatMessageContent";

export default function InterviewSessionPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    session,
    messages,
    isSending,
    error,
    addMessage,
    incrementQuestion,
    markComplete,
    setSending,
    setError,
    setReport,
  } = useInterviewStore();

  const [answer, setAnswer] = useState("");
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  // Redirect if no session
  useEffect(() => {
    if (!session) {
      router.replace(ROUTES.profileSetup);
    }
  }, [session, router]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  if (!session) return null;

  const progress = Math.min(
    100,
    ((session.currentQuestionNumber - 1) / session.questionCount) * 100,
  );

  const handleSubmit = async () => {
    const trimmed = answer.trim();
    if (!trimmed || isSending) return;
    if (trimmed.length < 10) {
      setError("Please provide a more complete answer.");
      return;
    }

    setSending(true);
    setError(null);
    setAnswer("");

    // Add user message immediately for responsive UI
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);

    try {
      // Build history for the API (exclude system messages)
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      const res = await fetch(ROUTES.api.interview.message, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.sessionId,
          message: trimmed,
          systemContext: session.systemContext,
          history,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error?.message ?? "Failed to get response. Please try again.");
        return;
      }

      addMessage(data.data.message);
      incrementQuestion();

      if (data.data.sessionComplete) {
        markComplete();
        handleGenerateReport();
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleGenerateReport = async () => {
    setIsEnding(true);

    try {
      const transcript = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(ROUTES.api.interview.end, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.sessionId,
          candidateId: session.candidateId,
          targetRole: session.targetRole,
          transcript,
          candidateProfile: session.extractedProfile,
          jobAnalysis: session.jobAnalysis,
          skillMatch: session.skillMatch,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReport(data.data.report);
        router.push(ROUTES.interviewReport);
      } else {
        setError("Could not generate report: " + (data.error?.message ?? "Unknown error"));
      }
    } catch {
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsEnding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Filter to interview-visible messages (no system messages)
  const visibleMessages = messages.filter(
    (m) => m.role === "user" || m.role === "assistant",
  );

  return (
    <div className="flex h-screen flex-col bg-surface">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-surface-border bg-surface px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <span className="text-xs font-bold text-white">IQ</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{session.targetRole}</p>
              <p className="caption">
                Question {Math.min(session.currentQuestionNumber, session.questionCount)} of {session.questionCount}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowEndConfirm(true)}
            className="flex items-center gap-1.5 rounded-lg border border-surface-border px-3 py-1.5 text-xs text-ink-muted hover:bg-surface-subtle"
          >
            <Flag className="h-3.5 w-3.5" />
            End interview
          </button>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-2 max-w-3xl">
          <Progress value={progress} />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
          {visibleMessages.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-ink-placeholder" />
            </div>
          )}

          {visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "assistant" && (
                <div className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 mt-1">
                  <span className="text-xs font-bold text-white">IQ</span>
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "assistant"
                    ? "bg-surface-subtle text-ink rounded-tl-sm"
                    : "bg-brand-600 text-white rounded-tr-sm",
                )}
              >
                <ChatMessageContent content={msg.content} role={msg.role as "user" | "assistant"} />
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 mt-1">
                <span className="text-xs font-bold text-white">IQ</span>
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-surface-subtle px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink-placeholder" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink-placeholder" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-ink-placeholder" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error bar */}
      {error && (
        <div className="border-t border-danger-500/20 bg-danger-50 px-4 py-2 text-center text-xs text-danger-700">
          {error}
          <button onClick={() => setError(null)} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 border-t border-surface-border bg-surface p-4">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here… (Ctrl+Enter to submit)"
              rows={3}
              disabled={isSending || session.status === "completed"}
              className={cn(
                "w-full resize-none rounded-xl border border-surface-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-placeholder",
                "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              aria-label="Your answer"
            />
            <span className={cn(
              "absolute bottom-2 right-3 text-xs",
              answer.length > 1800 ? "text-danger-500" : "text-ink-placeholder",
            )}>
              {answer.length}/2000
            </span>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSending || session.status === "completed"}
            isLoading={isSending}
            className="flex-shrink-0"
            size="lg"
            aria-label="Submit answer"
          >
            {!isSending && <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* End interview confirmation modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4">
          <div className="card max-w-sm w-full p-6">
            <h3 className="heading-3 mb-2">End interview?</h3>
            <p className="body-sm mb-6">
              You&apos;ve answered {session.currentQuestionNumber - 1} of {session.questionCount} questions.
              The report will be generated from your answers so far.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowEndConfirm(false)}>
                Continue
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                isLoading={isEnding}
                onClick={() => {
                  setShowEndConfirm(false);
                  markComplete();
                  handleGenerateReport();
                }}
              >
                End & get report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Generating report overlay */}
      {isEnding && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-surface/90">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
          <p className="heading-4">Generating your report…</p>
          <p className="body-sm">IBM Granite is analysing your interview — this takes about 20 seconds.</p>
        </div>
      )}
    </div>
  );
}
