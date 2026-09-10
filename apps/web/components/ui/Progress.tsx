// ============================================================
// InterviewIQ — Progress Bar Component
// ============================================================

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number; // 0–100
  label?: string;
  showValue?: boolean;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}

function Progress({
  value,
  label,
  showValue,
  className,
  trackClassName,
  fillClassName,
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="caption">{label}</span>}
          {showValue && (
            <span className="caption font-medium">{clampedValue}%</span>
          )}
        </div>
      )}
      <div
        className={cn("progress-track", trackClassName)}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn("progress-fill", fillClassName)}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

export { Progress };
