// ============================================================
// InterviewIQ — BFF: Send Interview Message
// POST /api/interview/message
// Relays the full conversation history to Orchestrate agent
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { orchestrateClient } from "@/lib/ibm/orchestrate";
import { OrchestrateError } from "@/lib/ibm/orchestrate";
import { IbmAuthError } from "@/lib/ibm/iam";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const schema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(3000),
  systemContext: z.string().min(1),
  // Full conversation history so far (excluding the current new message)
  history: z.array(messageSchema),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0]?.message ?? "Invalid input" } },
        { status: 400 },
      );
    }

    const { message, systemContext, history } = parsed.data;

    // Append the new user message to history
    const fullHistory = [
      ...history,
      { role: "user" as const, content: message },
    ];

    const result = await orchestrateClient.chat({
      history: fullHistory,
      systemContext,
    });

    return NextResponse.json({
      success: true,
      data: {
        message: result.message,
        sessionComplete: result.sessionComplete ?? false,
      },
    });
  } catch (err) {
    console.error("[/api/interview/message]", err);
    if (err instanceof IbmAuthError) {
      return NextResponse.json(
        { success: false, error: { code: "IBM_AUTH_ERROR", message: "IBM authentication failed." } },
        { status: 503 },
      );
    }
    if (err instanceof OrchestrateError) {
      return NextResponse.json(
        { success: false, error: { code: "ORCHESTRATE_ERROR", message: err.message } },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to send message." } },
      { status: 500 },
    );
  }
}
