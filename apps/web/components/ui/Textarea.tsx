// ============================================================
// InterviewIQ — Textarea Component
// ============================================================

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error, label, hint, showCharCount, maxLength, id, value, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="label">
            {label}
            {props.required && (
              <span className="ml-0.5 text-danger-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[100px] w-full rounded-lg border border-surface-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-ink-placeholder",
            "resize-y transition-colors duration-150",
            "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-subtle",
            error && "border-danger-500 focus:ring-danger-500/20",
            className,
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
          {...props}
        />
        <div className="flex items-start justify-between">
          {hint && !error && (
            <p id={`${textareaId}-hint`} className="caption">
              {hint}
            </p>
          )}
          {error && (
            <p
              id={`${textareaId}-error`}
              className="text-xs text-danger-500"
              role="alert"
            >
              {error}
            </p>
          )}
          {showCharCount && maxLength && (
            <p
              className={cn(
                "caption ml-auto",
                charCount > maxLength * 0.9 && "text-warning-700",
                charCount >= maxLength && "text-danger-500",
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
