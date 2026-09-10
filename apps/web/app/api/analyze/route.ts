// ============================================================
// InterviewIQ — BFF: Full Profile Analysis
// POST /api/analyze
// Runs: profile extraction → JD analysis → skill match → interview plan
// All via IBM Granite (server-side only)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { graniteClient } from "@/lib/ibm/granite";
import { GraniteError } from "@/lib/ibm/granite";
import { IbmAuthError } from "@/lib/ibm/iam";
import { z } from "zod";

const schema = z.object({
  resumeText: z.string().min(50, "Resume text is too short"),
  targetRole: z.string().min(2),
  jobDescriptionText: z.string().optional(),
  questionCount: z.number().int().min(5).max(20).default(10),
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

    const { resumeText, targetRole, jobDescriptionText, questionCount } = parsed.data;

    // Step 1: Extract profile from resume
    let profileData;
    try {
      profileData = await graniteClient.extractProfileFromResume(resumeText);
    } catch (err) {
      return graniteErrorResponse(err, "Failed to extract profile from resume");
    }

    // Step 2: Analyse job description (if provided, else use role name only)
    let jobAnalysis;
    try {
      const jdInput = jobDescriptionText && jobDescriptionText.length > 20
        ? jobDescriptionText
        : `Role: ${targetRole}. This is a ${targetRole} position requiring strong technical and communication skills.`;
      jobAnalysis = await graniteClient.analyseJobDescription(targetRole, jdInput);
    } catch (err) {
      return graniteErrorResponse(err, "Failed to analyse job description");
    }

    // Step 3: Match candidate to job
    let skillMatch;
    try {
      skillMatch = await graniteClient.matchCandidateToJob(profileData, jobAnalysis);
    } catch (err) {
      return graniteErrorResponse(err, "Failed to match candidate to job");
    }

    // Step 4: Generate interview plan
    let interviewPlan;
    try {
      interviewPlan = await graniteClient.generateInterviewPlan(
        profileData,
        jobAnalysis,
        skillMatch,
        questionCount,
      );
    } catch (err) {
      return graniteErrorResponse(err, "Failed to generate interview plan");
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: profileData,
        jobAnalysis,
        skillMatch,
        interviewPlan,
      },
    });
  } catch (err) {
    console.error("[/api/analyze]", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Analysis failed. Please try again." } },
      { status: 500 },
    );
  }
}

function graniteErrorResponse(err: unknown, context: string): NextResponse {
  console.error(`[/api/analyze] ${context}:`, err);

  if (err instanceof IbmAuthError) {
    return NextResponse.json(
      { success: false, error: { code: "IBM_AUTH_ERROR", message: "IBM authentication failed. Check IBM_WATSONX_API_KEY." } },
      { status: 503 },
    );
  }
  if (err instanceof GraniteError) {
    return NextResponse.json(
      { success: false, error: { code: "GRANITE_ERROR", message: `${context}: ${err.message}` } },
      { status: 503 },
    );
  }
  return NextResponse.json(
    { success: false, error: { code: "ANALYSIS_ERROR", message: context } },
    { status: 500 },
  );
}
