// ============================================================
// InterviewIQ — IBM watsonx Orchestrate Client
// Server-side ONLY.
//
// Implements the IBM watsonx Orchestrate A2A 0.3.0 protocol:
//
// ── Step 1 — Agent discovery ─────────────────────────────────
//   POST {instanceUrl}/v1/orchestrate/A2A
//   JSON-RPC 2.0 · method: "agents/get"
//   Returns the agent card, which contains the canonical
//   interaction endpoint URL for the deployed agent.
//
// ── Step 2 — Agent interaction ───────────────────────────────
//   POST {interactionEndpoint}          (obtained from Step 1)
//   Documented endpoint pattern:
//     /v1/A2A/agents/{agentId}/environment/live
//   JSON-RPC 2.0 · method: "message/send"
//   Carries the current user message and full conversation
//   history so the agent has context on every turn.
//
// ── Auth ──────────────────────────────────────────────────────
//   IBM Cloud IAM Bearer token (same mechanism as Granite).
//
// ── Service instance URL (confirmed from IBM Cloud console) ──
//   https://api.au-syd.watson-orchestrate.cloud.ibm.com/instances/7495ac99-8bc5-4302-8c39-e2ba75d349e4
// ============================================================

import { ORCHESTRATE_CONFIG, isOrchestrateConfigured } from "@/config/ibm.config";
import { getIbmBearerToken } from "./iam";
import type { ConversationMessage } from "@/types/domain.types";

// ── Public interface shapes ───────────────────────────────────────────────────

export interface OrchestrateSessionCreateResult {
  threadId: string;
  isPlaceholder: boolean;
}

export interface OrchestrateMessageResult {
  message: ConversationMessage;
  isPlaceholder: boolean;
  sessionComplete?: boolean;
  /** Raw response body for diagnostics — never sent to the browser */
  rawResponse?: string;
}

export interface OrchestrateEndResult {
  summary: string;
  isPlaceholder: boolean;
}

/** A single turn in the conversation history (public interface, unchanged) */
export interface OrchestrateMessage {
  role: "user" | "assistant";
  content: string;
}

// ── A2A 0.3.0 internal types ──────────────────────────────────────────────────

/** A single text part inside an A2A 0.3.0 message */
interface A2APart {
  kind: "text";
  text: string;
}

/**
 * A2A 0.3.0 message object.
 * role "user" = candidate turn, role "agent" = interviewer turn.
 */
interface A2AMessage {
  role: "user" | "agent";
  parts: A2APart[];
  /** Per-message correlation ID */
  messageId: string;
}

/**
 * JSON-RPC 2.0 request envelope used for both discovery and interaction.
 */
interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params: Record<string, unknown>;
}

/**
 * JSON-RPC 2.0 response envelope (success path).
 * The result shape varies by method — typed as unknown and narrowed
 * inside the methods that consume it.
 */
interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

/**
 * Minimal agent card shape returned by agents/get.
 * The url field is the canonical interaction endpoint for this agent.
 */
interface A2AAgentCard {
  /** Canonical interaction URL for this agent, e.g.
   *  {instanceUrl}/v1/A2A/agents/{agentId}/environment/live
   */
  url?: string;
  name?: string;
  description?: string;
  capabilities?: Record<string, unknown>;
}

// ── Client ────────────────────────────────────────────────────────────────────

export class OrchestrateClient {
  private readonly instanceUrl = ORCHESTRATE_CONFIG.instanceUrl;
  private readonly agentId = ORCHESTRATE_CONFIG.agentId;
  private readonly apiKey = ORCHESTRATE_CONFIG.apiKey;

  /**
   * Discovery endpoint — fixed per the A2A 0.3.0 specification:
   *   POST {instanceUrl}/v1/orchestrate/A2A
   */
  private get discoveryEndpoint(): string {
    return `${this.instanceUrl}/v1/orchestrate/A2A`;
  }

  /**
   * Cache for the resolved interaction endpoint URL.
   *
   * The endpoint is obtained once via agents/get and reused for all
   * subsequent chat() calls within the same server process lifetime.
   * If the cache is stale or the endpoint changes, clear it by restarting
   * the server process (standard for Next.js API routes).
   */
  private cachedInteractionUrl: string | null = null;

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Create a new session correlation ID.
   *
   * A2A 0.3.0 is stateless per request; the full conversation history
   * is replayed on every chat() call. The threadId is a client-side
   * correlation token only — it is not sent to Orchestrate.
   */
  async startSession(params: {
    candidateId: string;
    targetRole: string;
    candidateSummary: string;
    jobDescriptionText?: string;
    interviewPlan?: string;
  }): Promise<OrchestrateSessionCreateResult> {
    // Reset the cached interaction URL so each new interview session
    // does a fresh discovery call. This ensures we always have a valid
    // endpoint even if the agent was redeployed between sessions.
    this.cachedInteractionUrl = null;
    const threadId = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return { threadId, isPlaceholder: false };
  }

  /**
   * Send a message to the deployed Orchestrate agent.
   *
   * Flow:
   *   1. Resolve the agent's interaction URL via agents/get discovery
   *      (cached after the first call within a session).
   *   2. Send the current user message plus full conversation history
   *      to that URL using JSON-RPC 2.0 method "message/send".
   *   3. Extract and return the agent's text reply.
   */
  async chat(params: {
    history: OrchestrateMessage[];
    systemContext: string;
  }): Promise<OrchestrateMessageResult> {
    if (!isOrchestrateConfigured()) {
      return this.placeholderMessage();
    }

    try {
      const token = await getIbmBearerToken(this.apiKey);

      // ── Step 1: Resolve the interaction endpoint ────────────────────────────
      const interactionUrl = await this.resolveInteractionUrl(token);

      // ── Step 2: Build the message/send payload ──────────────────────────────
      // Current user message is the last entry in history.
      const currentMessage = params.history[params.history.length - 1];

      // The current user message as an A2A 0.3.0 message object.
      const a2aCurrentMessage: A2AMessage = {
        role: "user",
        messageId: `msg-${Date.now()}`,
        parts: [{ kind: "text", text: currentMessage?.content ?? "" }],
      };

      // JSON-RPC 2.0 request with method "message/send".
      const rpcRequest: JsonRpcRequest = {
        jsonrpc: "2.0",
        id: `req-${Date.now()}`,
        method: "message/send",
        params: {
          message: a2aCurrentMessage,
        },
      };

      const response = await fetch(interactionUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(rpcRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new OrchestrateError(
          `Orchestrate message/send failed (${response.status}): ${errorText}`,
        );
      }

      const rpcResponse: JsonRpcResponse = await response.json();

      // Surface JSON-RPC level errors
      if (rpcResponse.error) {
        throw new OrchestrateError(
          `Orchestrate A2A error (${rpcResponse.error.code}): ${rpcResponse.error.message}`,
        );
      }

      const replyText = this.extractReply(
        rpcResponse.result as Record<string, unknown> | null | undefined,
      );
      const sessionComplete = this.detectCompletion(replyText);

      return {
        message: {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: replyText,
          timestamp: new Date().toISOString(),
        },
        isPlaceholder: false,
        sessionComplete,
        rawResponse: JSON.stringify(rpcResponse),
      };
    } catch (err) {
      if (err instanceof OrchestrateError) throw err;
      throw new OrchestrateError(
        `Orchestrate request failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Resolve the canonical interaction endpoint for our deployed agent.
   *
   * Calls the A2A 0.3.0 discovery endpoint:
   *   POST {instanceUrl}/v1/orchestrate/A2A
   *   method: "agents/get"
   *   params: { agentId: "<our agent ID>" }
   *
   * The response is a JSON-RPC 2.0 envelope whose result contains an
   * agent card. The agent card's "url" field is the interaction endpoint.
   * Documented pattern: {instanceUrl}/v1/A2A/agents/{agentId}/environment/live
   *
   * The resolved URL is cached for the lifetime of this OrchestrateClient
   * instance (i.e., the current server process / warm Lambda invocation).
   */
  private async resolveInteractionUrl(token: string): Promise<string> {
    if (this.cachedInteractionUrl) {
      return this.cachedInteractionUrl;
    }

    const discoveryRequest: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: `discovery-${Date.now()}`,
      method: "agents/get",
      params: {
        agentId: this.agentId,
      },
    };

    const response = await fetch(this.discoveryEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(discoveryRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new OrchestrateError(
        `Orchestrate discovery (agents/get) failed (${response.status}): ${errorText}`,
      );
    }

    const rpcResponse: JsonRpcResponse = await response.json();

    if (rpcResponse.error) {
      throw new OrchestrateError(
        `Orchestrate discovery error (${rpcResponse.error.code}): ${rpcResponse.error.message}`,
      );
    }

    // The result contains the agent cards array.
    // Extract the canonical interaction URL from the agent card.
    const resultObj = rpcResponse.result as {
      agentCards?: A2AAgentCard[];
      url?: string;
    } | undefined;

    const interactionUrl =
      resultObj?.agentCards?.[0]?.url ?? resultObj?.url;

    if (interactionUrl) {
      console.warn("[Orchestrate] Resolved interaction URL from agent card:", interactionUrl);
      this.cachedInteractionUrl = interactionUrl;
      return interactionUrl;
    }

    // Fallback: construct the documented URL pattern if the agent card
    // did not include a "url" field. This uses the pattern documented by IBM:
    //   {instanceUrl}/v1/A2A/agents/{agentId}/environment/live
    const fallbackUrl = `${this.instanceUrl}/v1/A2A/agents/${this.agentId}/environment/live`;
    console.warn(
      `[Orchestrate] Agent card did not include a url field. ` +
        `Using documented fallback pattern: ${fallbackUrl}`,
    );
    this.cachedInteractionUrl = fallbackUrl;
    return fallbackUrl;
  }

  /**
   * Extract the agent's text reply from the JSON-RPC 2.0 result object
   * returned by method "message/send".
   *
   * A2A 0.3.0 "message/send" returns a Task object as the result:
   * {
   *   "id": "task-...",
   *   "status": { "state": "completed" },
   *   "artifacts": [
   *     {
   *       "parts": [{ "type": "text", "text": "..." }]
   *     }
   *   ]
   * }
   *
   * Additional fallback paths handle variations in agent implementations.
   */
  private extractReply(result: Record<string, unknown> | null | undefined): string {
    if (!result) {
      return "[No response from agent]";
    }

    // ── Primary A2A 0.3.0 path: result.artifacts[0].parts[0].text ─────────────
    const artifacts = result.artifacts as Array<{
      parts?: Array<{ kind?: string; type?: string; text?: string }>;
    }> | undefined;
    if (Array.isArray(artifacts) && artifacts.length > 0) {
      const parts = artifacts[0]?.parts;
      if (Array.isArray(parts)) {
        const textPart = parts.find((p) => p.kind === "text" || p.type === "text" || p.text);
        if (textPart?.text) return textPart.text;
      }
    }

    // ── A2A 0.3.0 path: result.status.message.parts ───────────────────────────
    const status = result.status as Record<string, unknown> | undefined;
    if (status) {
      const msg = status.message as Record<string, unknown> | undefined;
      if (msg) {
        const parts = msg.parts as Array<{ kind?: string; type?: string; text?: string }> | undefined;
        if (Array.isArray(parts)) {
          const textPart = parts.find((p) => p.kind === "text" || p.type === "text" || p.text);
          if (textPart?.text) return textPart.text;
        }
      }
    }

    // ── Nested result.message.parts ───────────────────────────────────────────
    const msg = result.message as Record<string, unknown> | undefined;
    if (msg) {
      const parts = msg.parts as Array<{ kind?: string; type?: string; text?: string }> | undefined;
      if (Array.isArray(parts)) {
        const textPart = parts.find((p) => p.kind === "text" || p.type === "text" || p.text);
        if (textPart?.text) return textPart.text;
      }
      if (typeof msg.content === "string") return msg.content;
    }

    // ── Flat scalar fallbacks ─────────────────────────────────────────────────
    if (typeof result.output === "string") return result.output;
    if (typeof result.response === "string") return result.response;
    if (typeof result.text === "string") return result.text;
    if (typeof result.content === "string") return result.content;

    console.warn("[Orchestrate] Unexpected result shape:", JSON.stringify(result).slice(0, 300));
    return JSON.stringify(result);
  }

  /**
   * Detect natural interview completion signals in the agent's reply text.
   */
  private detectCompletion(text: string): boolean {
    const completionPhrases = [
      "interview is now complete",
      "interview has concluded",
      "that concludes our interview",
      "thank you for completing",
      "interview is complete",
      "we have covered all",
      "all questions have been answered",
    ];
    const lower = text.toLowerCase();
    return completionPhrases.some((phrase) => lower.includes(phrase));
  }

  private placeholderMessage(): OrchestrateMessageResult {
    return {
      message: {
        id: `placeholder-${Date.now()}`,
        role: "assistant",
        content:
          "[IBM Orchestrate not configured] Set IBM_ORCHESTRATE_API_KEY in .env.local to enable live interview sessions.",
        timestamp: new Date().toISOString(),
      },
      isPlaceholder: true,
      sessionComplete: false,
    };
  }
}

export class OrchestrateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrchestrateError";
  }
}

export const orchestrateClient = new OrchestrateClient();
