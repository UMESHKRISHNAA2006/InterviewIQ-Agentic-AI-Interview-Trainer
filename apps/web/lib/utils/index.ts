// ============================================================
// InterviewIQ — Utility Functions
// ============================================================

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely, resolving conflicts.
 * Use everywhere className props are composed.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string to a readable local format.
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));
}

/**
 * Formats a date string to include time.
 */
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

/**
 * Truncates a string to a given length with an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Generates a simple pseudo-random ID for placeholder use.
 * For production, use a proper UUID library or server-generated IDs.
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Returns a score colour class based on a 0–100 score.
 */
export function scoreToColour(score: number): string {
  if (score >= 80) return "text-success-700";
  if (score >= 60) return "text-warning-700";
  return "text-danger-700";
}

/**
 * Returns a score background class based on a 0–100 score.
 */
export function scoreToBgColour(score: number): string {
  if (score >= 80) return "bg-success-50 text-success-700";
  if (score >= 60) return "bg-warning-50 text-warning-700";
  return "bg-danger-50 text-danger-700";
}

/**
 * Formats a file size in bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Safely parses a JSON string, returning null on failure.
 */
export function safeJsonParse<T>(str: string): T | null {
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

/**
 * Returns a percentage string rounded to the nearest integer.
 */
export function toPercent(value: number): string {
  return `${Math.round(value)}%`;
}
