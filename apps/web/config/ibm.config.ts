// ============================================================
// InterviewIQ — IBM Service Configuration
// Server-side ONLY. Never import this in client components.
// ============================================================

function getEnv(key: string): string {
  return process.env[key] || "";
}

// ── IBM watsonx.ai (Granite) ─────────────────────────────────────────────────
export const WATSONX_CONFIG = {
  apiKey: getEnv("IBM_WATSONX_API_KEY"),
  projectId: getEnv("IBM_WATSONX_PROJECT_ID") || "9c8e45bd-f626-4a35-95f1-34f191606946",
  region: getEnv("IBM_WATSONX_REGION") || "us-south",
  baseUrl: getEnv("IBM_WATSONX_BASE_URL") || "https://us-south.ml.cloud.ibm.com",
  models: {
    granite4HSmall: "ibm/granite-4-h-small",
  },
  defaults: {
    maxNewTokens: 1024,
    temperature: 0.1,
    topP: 0.95,
  },
} as const;

// ── IBM watsonx Orchestrate ───────────────────────────────────────────────────
export const ORCHESTRATE_CONFIG = {
  apiKey: getEnv("IBM_ORCHESTRATE_API_KEY"),
  // Confirmed service instance URL from IBM Cloud → watsonx Orchestrate → API credentials
  // Format: https://api.{region}.watson-orchestrate.cloud.ibm.com/instances/{instanceId}
  instanceUrl:
    getEnv("IBM_ORCHESTRATE_INSTANCE_URL") ||
    "https://api.au-syd.watson-orchestrate.cloud.ibm.com/instances/7495ac99-8bc5-4302-8c39-e2ba75d349e4",
  agentId: getEnv("IBM_ORCHESTRATE_AGENT_ID") || "4591effc-aca1-4564-aa52-dfdef976dc58",
} as const;

// ── IBM IAM ───────────────────────────────────────────────────────────────────
export const IAM_CONFIG = {
  tokenUrl: getEnv("IBM_IAM_TOKEN_URL") || "https://iam.cloud.ibm.com/identity/token",
  tokenTtlMs: 55 * 60 * 1000,
} as const;

/**
 * Returns true when the minimum IBM credentials are present.
 */
export function isGraniteConfigured(): boolean {
  return !!(process.env.IBM_WATSONX_API_KEY && process.env.IBM_WATSONX_PROJECT_ID);
}

export function isOrchestrateConfigured(): boolean {
  return !!(process.env.IBM_ORCHESTRATE_API_KEY);
}

export function isIbmConfigured(): boolean {
  return isGraniteConfigured() && isOrchestrateConfigured();
}
