// ============================================================
// InterviewIQ — Chat Message Content Component
// Renders Markdown for assistant messages and plain text for user messages.
// ============================================================

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Normalizes literal backslash-escaped Markdown syntax from LLM/Orchestrate output
 * (e.g. \*\* -> **, \# -> #, \- -> -) without removing legitimate backslashes in text/code.
 */
export function normalizeMarkdownEscapes(content: string): string {
  if (!content) return "";
  return content.replace(/\\(\*|_|#|-|\+|\!|\[|\]|\(|\)|`|>)/g, "$1");
}

interface ChatMessageContentProps {
  content: string;
  role: "user" | "assistant";
  className?: string;
}

export const ChatMessageContent: React.FC<ChatMessageContentProps> = ({
  content,
  role,
  className,
}) => {
  if (role === "user") {
    return <div className={className}>{content}</div>;
  }

  const normalizedContent = normalizeMarkdownEscapes(content);

  return (
    <div className={cn("markdown-content space-y-2 text-sm leading-relaxed text-ink", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-3 mb-1.5 border-b border-surface-border pb-1 text-base font-bold text-ink">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-2.5 mb-1 text-sm font-bold text-ink">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-2 mb-1 text-sm font-semibold text-ink">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-2 mb-0.5 text-sm font-semibold text-ink">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="mb-2 text-ink leading-relaxed last:mb-0">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-ink">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-ink">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="my-2 ml-4 list-disc space-y-1 text-ink">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 ml-4 list-decimal space-y-1 text-ink">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-ink">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-2 border-brand-500 pl-3 italic text-ink-muted">
              {children}
            </blockquote>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const match = /language-(\w+)/.exec(codeClassName || "");
            const isInline = !match && !String(children).includes("\n");
            if (isInline) {
              return (
                <code
                  className="rounded bg-surface-border/50 px-1.5 py-0.5 font-mono text-xs font-medium text-brand-700"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="my-2.5 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-100">
                <code className={codeClassName} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          hr: () => <hr className="my-3 border-surface-border" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-600 underline hover:text-brand-700"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-surface-border">
              <table className="min-w-full divide-y divide-surface-border text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-subtle font-semibold text-ink">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-surface-border bg-surface">{children}</tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-3 py-2 text-left font-semibold text-ink">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-ink">{children}</td>
          ),
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};
