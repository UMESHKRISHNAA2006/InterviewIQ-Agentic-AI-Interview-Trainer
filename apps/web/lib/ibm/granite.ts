// ============================================================
// InterviewIQ — IBM Granite Client
// Server-side ONLY.
// Model: ibm/granite-4-h-small
// ============================================================

import { WATSONX_CONFIG, isGraniteConfigured } from "@/config/ibm.config";
import { getIbmBearerToken, IbmAuthError } from "./iam";

export interface GraniteMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GraniteGenerateOptions {
  messages: GraniteMessage[];
  maxNewTokens?: number;
  temperature?: number;
  topP?: number;
  systemPrompt?: string;
}

export interface GraniteGenerateResult {
  text: string;
  isPlaceholder: boolean;
  model: string;
  usage?: { promptTokens: number; completionTokens: number };
}

// ── Structured output types ───────────────────────────────────────────────────

export interface ExtractedProfile {
  name?: string;
  email?: string;
  phone?: string;
  currentRole?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  skills: string[];
  technologies: string[];
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear?: number;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration?: string;
    highlights: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
  }>;
  certifications: string[];
  achievements: string[];
  strengths: string[];
}

export interface JobAnalysis {
  role: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  experienceRequired: string;
  technicalAreas: string[];
  behavioralAreas: string[];
  interviewFocusAreas: string[];
  qualifications: string[];
}

export interface SkillMatchResult {
  matchedSkills: string[];
  partiallyMatchedSkills: string[];
  missingSkills: string[];
  relevantProjects: string[];
  preparationPriorities: string[];
  matchScore: number;
  matchSummary: string;
}

export interface InterviewPlanResult {
  totalQuestions: number;
  distribution: Record<string, number>;
  focusAreas: string[];
  suggestedTopics: string[];
  openingContext: string;
}

export interface FinalReportResult {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  behavioralScore: number;
  strengths: string[];
  weaknesses: string[];
  questionObservations: Array<{
    question: string;
    observation: string;
    score: number;
  }>;
  skillGaps: string[];
  improvementRecommendations: string[];
  learningRoadmap: Array<{
    skill: string;
    priority: "high" | "medium" | "low";
    resources: string[];
    estimatedWeeks: number;
  }>;
}

// ── Client ────────────────────────────────────────────────────────────────────

export class GraniteClient {
  private readonly model = WATSONX_CONFIG.models.granite4HSmall;
  private readonly baseUrl = WATSONX_CONFIG.baseUrl;
  private readonly projectId = WATSONX_CONFIG.projectId;
  private readonly apiKey = WATSONX_CONFIG.apiKey;

  async generate(options: GraniteGenerateOptions): Promise<GraniteGenerateResult> {
    if (!isGraniteConfigured()) {
      return {
        text: JSON.stringify({ error: "IBM_WATSONX_API_KEY not configured" }),
        isPlaceholder: true,
        model: this.model,
      };
    }

    try {
      const token = await getIbmBearerToken(this.apiKey);

      const messages: GraniteMessage[] = options.systemPrompt
        ? [{ role: "system", content: options.systemPrompt }, ...options.messages]
        : options.messages;

      const payload = {
        model_id: this.model,
        project_id: this.projectId,
        messages,
        response_format: { type: "json_object" },
        parameters: {
          max_new_tokens: options.maxNewTokens ?? WATSONX_CONFIG.defaults.maxNewTokens,
          temperature: options.temperature ?? WATSONX_CONFIG.defaults.temperature,
          top_p: options.topP ?? WATSONX_CONFIG.defaults.topP,
        },
      };

      const url = `${this.baseUrl}/ml/v1/text/chat?version=2024-03-13`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new GraniteError(`Granite API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      if (data.choices?.[0]?.finish_reason === "length") {
        throw new GraniteError(
          "Granite response exceeded the 1024-token completion limit. Reduce requested output size.",
        );
      }
      const text = data.choices?.[0]?.message?.content ?? "";

      return {
        text,
        isPlaceholder: false,
        model: this.model,
        usage: data.usage
          ? { promptTokens: data.usage.prompt_tokens, completionTokens: data.usage.completion_tokens }
          : undefined,
      };
    } catch (err) {
      if (err instanceof IbmAuthError || err instanceof GraniteError) throw err;
      throw new GraniteError(
        `Granite request failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // ── Structured JSON generation ─────────────────────────────────────────────

  private async generateJson<T>(
    systemPrompt: string,
    userContent: string,
    maxNewTokens = 1200,
  ): Promise<T> {
    const result = await this.generate({
      systemPrompt,
      messages: [{ role: "user", content: userContent }],
      maxNewTokens,
      temperature: 0.05,
    });

    const raw = result.text.trim();
    return this.parseJson<T>(raw);
  }

  private parseJson<T>(raw: string): T {
    // Strip markdown code fences if present
    let cleaned = raw;
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    // Find JSON object boundaries
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.slice(start, end + 1);
    }

    try {
      return JSON.parse(cleaned) as T;
    } catch {
      const isIncomplete = !raw.trim().endsWith("}") && !raw.trim().endsWith("```");
      const hint = isIncomplete ? " (response may have been incomplete or truncated)" : "";
      throw new GraniteError(`Failed to parse Granite JSON response${hint}: ${raw.slice(0, 200)}`);
    }
  }

  // ── Domain methods ─────────────────────────────────────────────────────────

  async extractProfileFromResume(resumeText: string): Promise<ExtractedProfile> {
    const truncated = resumeText.slice(0, 3500);
    return this.generateJson<ExtractedProfile>(
      `You are a precise resume parser. Extract structured information from resume text into a compact JSON object.
Return ONLY a valid JSON object with these exact fields:
{
  "name": string or null,
  "email": string or null,
  "phone": string or null,
  "currentRole": string or null,
  "currentCompany": string or null,
  "yearsOfExperience": number or null,
  "skills": array of strings (max 15 key skills),
  "technologies": array of strings (max 15 key technologies),
  "education": array of {"institution": string, "degree": string, "field": string, "graduationYear": number or null},
  "experience": array of {"company": string, "role": string, "duration": string, "highlights": array of strings (max 2 highlights each)} (max 3 items),
  "projects": array of {"name": string, "description": string (one concise sentence), "technologies": array of strings} (max 3 items),
  "certifications": array of strings (max 5),
  "achievements": array of strings (max 5),
  "strengths": array of strings (max 5)
}
Rules:
- Extract at most 3 experience items with max 2 highlights per item.
- Extract at most 3 projects with one concise sentence description each.
- Keep skills and technologies concise (maximum 15 combined key skills and technologies).
- Extract at most 5 certifications, 5 achievements, 5 strengths.
- Do not repeat information. Use empty arrays when information is unavailable. Do not invent information.
- Return ONLY valid JSON, no commentary. Keep the entire JSON response comfortably below 1024 completion tokens.`,
      `Extract profile from this resume:\n\n${truncated}`,
      1000,
    );
  }

  async analyseJobDescription(targetRole: string, jdText: string): Promise<JobAnalysis> {
    const truncated = jdText.slice(0, 5000);
    return this.generateJson<JobAnalysis>(
      `You are a job description analyst. Extract structured requirements from job postings.
Return ONLY a valid JSON object with these exact fields:
{
  "role": string,
  "requiredSkills": array of strings,
  "preferredSkills": array of strings,
  "responsibilities": array of strings,
  "experienceRequired": string,
  "technicalAreas": array of strings,
  "behavioralAreas": array of strings,
  "interviewFocusAreas": array of strings,
  "qualifications": array of strings
}
Distinguish explicitly stated requirements from inferred topics.
Return ONLY the JSON object, no explanation.`,
      `Analyse this job description for the role of ${targetRole}:\n\n${truncated}`,
      1000,
    );
  }

  async matchCandidateToJob(
    profile: ExtractedProfile,
    jobAnalysis: JobAnalysis,
  ): Promise<SkillMatchResult> {
    const profileSummary = JSON.stringify({
      skills: profile.skills,
      technologies: profile.technologies,
      experience: profile.experience.map((e) => `${e.role} at ${e.company}`),
      projects: profile.projects.map((p) => p.name),
      certifications: profile.certifications,
    });

    return this.generateJson<SkillMatchResult>(
      `You are a career advisor. Compare a candidate's profile against job requirements.
Return ONLY a valid JSON object with these exact fields:
{
  "matchedSkills": array of strings (skills candidate has that match requirements),
  "partiallyMatchedSkills": array of strings (skills with partial overlap),
  "missingSkills": array of strings (required skills the candidate lacks),
  "relevantProjects": array of strings (candidate projects relevant to this role),
  "preparationPriorities": array of strings (top 5 areas candidate should focus on),
  "matchScore": number 0-100,
  "matchSummary": string (2-3 sentence summary)
}
Do NOT invent skills the candidate does not have. Be honest about gaps.
Return ONLY the JSON object.`,
      `Candidate profile:\n${profileSummary}\n\nJob requirements:\n${JSON.stringify(jobAnalysis)}`,
      800,
    );
  }

  async generateInterviewPlan(
    profile: ExtractedProfile,
    jobAnalysis: JobAnalysis,
    skillMatch: SkillMatchResult,
    questionCount: number,
  ): Promise<InterviewPlanResult> {
    return this.generateJson<InterviewPlanResult>(
      `You are an interview planner. Create a structured interview plan.
Return ONLY a valid JSON object with these exact fields:
{
  "totalQuestions": number,
  "distribution": {"technical": number, "behavioural": number, "situational": number, "role_specific": number},
  "focusAreas": array of strings,
  "suggestedTopics": array of strings,
  "openingContext": string (brief context for the interviewer agent, max 200 words)
}
Return ONLY the JSON object.`,
      `Role: ${jobAnalysis.role}
Total questions: ${questionCount}
Missing skills: ${skillMatch.missingSkills.join(", ")}
Focus areas: ${skillMatch.preparationPriorities.join(", ")}
Technical areas: ${jobAnalysis.technicalAreas.join(", ")}
Behavioral areas: ${jobAnalysis.behavioralAreas.join(", ")}`,
      600,
    );
  }

  async generateFinalReport(params: {
    transcript: Array<{ role: string; content: string }>;
    candidateProfile: ExtractedProfile;
    jobAnalysis: JobAnalysis;
    skillMatch: SkillMatchResult;
    targetRole: string;
  }): Promise<FinalReportResult> {
    const transcriptText = params.transcript
      .map((m) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
      .join("\n\n");

    const truncatedTranscript = transcriptText.slice(0, 8000);

    return this.generateJson<FinalReportResult>(
      `You are an interview evaluator. Analyse the interview transcript and generate a comprehensive performance report.
Return ONLY a valid JSON object with these exact fields:
{
  "overallScore": number 0-100,
  "technicalScore": number 0-100,
  "communicationScore": number 0-100,
  "behavioralScore": number 0-100,
  "strengths": array of strings,
  "weaknesses": array of strings,
  "questionObservations": array of {"question": string, "observation": string, "score": number 0-10},
  "skillGaps": array of strings,
  "improvementRecommendations": array of strings,
  "learningRoadmap": array of {"skill": string, "priority": "high"|"medium"|"low", "resources": array of strings, "estimatedWeeks": number}
}
Base scores ONLY on actual transcript content. If insufficient evidence exists, set score to 0 and note "Insufficient evidence".
Return ONLY the JSON object.`,
      `Role: ${params.targetRole}
Required skills: ${params.jobAnalysis.requiredSkills.join(", ")}
Missing skills: ${params.skillMatch.missingSkills.join(", ")}

Interview transcript:
${truncatedTranscript}`,
      2000,
    );
  }

  async evaluateAnswer(params: {
    question: string;
    answer: string;
    questionType: "technical" | "behavioural" | "situational";
    targetRole: string;
  }): Promise<{
    score: number;
    strengths: string[];
    improvements: string[];
    modelAnswer?: string;
  }> {
    return this.generateJson(
      `You are an interview evaluator. Evaluate a candidate answer.
Return ONLY a valid JSON object:
{
  "score": number 0-10,
  "strengths": array of strings (what was good),
  "improvements": array of strings (what could be better),
  "modelAnswer": string (brief ideal answer, max 100 words)
}
Return ONLY the JSON object.`,
      `Role: ${params.targetRole}
Question type: ${params.questionType}
Question: ${params.question}
Answer: ${params.answer}`,
      600,
    );
  }
}

export class GraniteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraniteError";
  }
}

export const graniteClient = new GraniteClient();
