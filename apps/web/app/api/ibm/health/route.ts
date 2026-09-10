// ============================================================
// InterviewIQ — BFF: IBM Health Check
// GET /api/ibm/health
// ============================================================

import { NextResponse } from "next/server";
import { isIbmConfigured } from "@/config/ibm.config";
import type { IbmHealthStatus } from "@/types/api.types";

export async function GET(): Promise<NextResponse> {
  const configured = isIbmConfigured();

  const status: IbmHealthStatus = {
    watsonxAi: configured ? "connected" : "unconfigured",
    orchestrate: configured ? "connected" : "unconfigured",
    timestamp: new Date().toISOString(),
  };

  // When credentials are present, attempt a lightweight connectivity check
  if (configured) {
    try {
      const { getIbmBearerToken } = await import("@/lib/ibm/iam");
      const { WATSONX_CONFIG } = await import("@/config/ibm.config");
      await getIbmBearerToken(WATSONX_CONFIG.apiKey);
      status.watsonxAi = "connected";
      status.orchestrate = "connected";
    } catch {
      status.watsonxAi = "error";
      status.orchestrate = "error";
    }
  }

  return NextResponse.json({ success: true, data: status });
}
