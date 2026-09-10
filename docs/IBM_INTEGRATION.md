# InterviewIQ — IBM Integration Guide

## Overview

InterviewIQ uses two IBM services:

| Service | Region | Purpose |
|---|---|---|
| IBM watsonx.ai (Granite 4.0 H-Small) | us-south (Dallas) | Profile extraction, JD analysis, skill-gap scoring |
| IBM watsonx Orchestrate | au-syd (Sydney) | Adaptive interview conversations, answer evaluation |

---

## 1. IBM watsonx.ai — Granite 4.0 H-Small

**Model ID:** `ibm/granite-4-h-small`

### Authentication

Granite uses IBM IAM API Key authentication. The API key is exchanged for a short-lived Bearer token via:

```
POST https://iam.cloud.ibm.com/identity/token
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=<IBM_WATSONX_API_KEY>
```

The token is cached server-side and refreshed automatically (55-minute window).

### Endpoint

```
POST https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2024-03-13
Authorization: Bearer <IAM_TOKEN>
Content-Type: application/json

{
  "model_id": "ibm/granite-4-h-small",
  "project_id": "<IBM_WATSONX_PROJECT_ID>",
  "messages": [...],
  "parameters": {
    "max_new_tokens": 1024,
    "temperature": 0.7,
    "top_p": 0.95
  }
}
```

### Integration File

`apps/web/lib/ibm/granite.ts` — `GraniteClient`

### Methods

| Method | Purpose |
|---|---|
| `generate(options)` | General text generation |
| `extractProfileFromResume(text)` | Parse resume → structured profile |
| `analyseJobDescription(text)` | Parse JD → structured requirements |
| `analyseSkillGap(skills, required, preferred)` | Score candidate vs job |

### Required Environment Variables

```env
IBM_WATSONX_API_KEY=
IBM_WATSONX_PROJECT_ID=
IBM_WATSONX_REGION=us-south
IBM_WATSONX_BASE_URL=https://us-south.ml.cloud.ibm.com
```

---

## 2. IBM watsonx Orchestrate — Interview Agent

The Orchestrate agent is **already deployed**. The frontend does not recreate any agent logic — it is purely a UI shell that relays messages to the agent and renders responses.

### Authentication

Same IBM IAM token mechanism as Granite.

### Endpoint Pattern (to be confirmed with credentials)

```
POST <IBM_ORCHESTRATE_BASE_URL>/v1/agents/<IBM_ORCHESTRATE_AGENT_ID>/sessions
→ Creates a new conversation thread

POST <IBM_ORCHESTRATE_BASE_URL>/v1/agents/<IBM_ORCHESTRATE_AGENT_ID>/sessions/<threadId>/messages
→ Sends a message, receives the agent's response

POST <IBM_ORCHESTRATE_BASE_URL>/v1/agents/<IBM_ORCHESTRATE_AGENT_ID>/sessions/<threadId>/end
→ Signals session completion, requests summary
```

> **⚠️ NOTE:** The exact REST API paths for watsonx Orchestrate must be confirmed when credentials are supplied. The paths above follow the published Orchestrate API pattern. Update `apps/web/lib/ibm/orchestrate.ts` when confirmed.

### Integration File

`apps/web/lib/ibm/orchestrate.ts` — `OrchestrateClient`

### Methods

| Method | Purpose |
|---|---|
| `startSession(params)` | Create a new interview session with context |
| `sendMessage(params)` | Relay a candidate answer, receive next question |
| `endSession(threadId)` | Signal completion, receive final evaluation |

### Required Environment Variables

```env
IBM_ORCHESTRATE_API_KEY=
IBM_ORCHESTRATE_INSTANCE_URL=
IBM_ORCHESTRATE_AGENT_ID=
IBM_ORCHESTRATE_BASE_URL=https://api.au-syd.watson-orchestrate.ibm.com
```

---

## 3. Development Without Credentials

Both clients automatically detect missing credentials and return clearly labelled **placeholder responses**:

```ts
// granite.ts — when IBM_WATSONX_API_KEY is not set:
return {
  text: "[PLACEHOLDER] IBM Granite is not configured...",
  isPlaceholder: true,
  model: "ibm/granite-4-h-small",
};

// orchestrate.ts — when IBM_ORCHESTRATE_API_KEY is not set:
return {
  message: {
    content: "Tell me about a challenging technical problem... [PLACEHOLDER]",
    ...
  },
  isPlaceholder: true,
};
```

This means the UI can be developed, styled, and tested end-to-end without live IBM credentials.

---

## 4. Adding Credentials

1. Copy `apps/web/.env.example` to `apps/web/.env.local`
2. Fill in all four IBM credential variables
3. Run `npm run dev` — the clients will use live IBM services automatically

---

## 5. Token Security

```
IBM_WATSONX_API_KEY     ← server env only (serverRuntimeConfig)
IBM_ORCHESTRATE_API_KEY ← server env only (serverRuntimeConfig)
IAM Bearer tokens       ← cached in server memory, never serialised
```

No IBM credentials or IAM tokens are ever sent to the browser, stored in localStorage, or logged.
