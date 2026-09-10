// ============================================================
// InterviewIQ — BFF: End Interview + Generate Report
// POST /api/interview/end
// Uses Granite to generate the final report from transcript
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { graniteClient } from "@/lib/ibm/granite";
import { GraniteError } from "@/lib/ibm/granite";
import { IbmAuthError } from "@/lib/ibm/iam";
import { generateId } from "@/lib/utils";
import { z } from "zod";

const messageSchema = z.object({
  role: z.string(),
  content: z.string(),
});

const schema = z.object({
  sessionId: z.string().min(1),
  candidateId: z.string().default("unknown"),
  targetRole: z.string().min(2),
  transcript: z.array(messageSchema).min(2),
  candidateProfile: z.any().optional(),
  jobAnalysis: z.any().optional(),
  skillMatch: z.any().optional(),
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

    const { sessionId, candidateId, targetRole, transcript, candidateProfile, jobAnalysis, skillMatch } = parsed.data;

    // Generate report using Granite
    let reportData;
    try {
      reportData = await graniteClient.generateFinalReport({
        transcript,
        candidateProfile: candidateProfile ?? { skills: [], technologies: [], education: [], experience: [], projects: [], certifications: [], achievements: [], strengths: [] },
        jobAnalysis: jobAnalysis ?? { role: targetRole, requiredSkills: [], preferredSkills: [], responsibilities: [], experienceRequired: "", technicalAreas: [], behavioralAreas: [], interviewFocusAreas: [], qualifications: [] },
        skillMatch: skillMatch ?? { matchedSkills: [], partiallyMatchedSkills: [], missingSkills: [], relevantProjects: [], preparationPriorities: [], matchScore: 0, matchSummary: "" },
        targetRole,
      });
    } catch (err) {
      console.error("[/api/interview/end] Granite report generation failed:", err);
      // Return partial report if Granite fails
      reportData = {
        overallScore: 0,
        technicalScore: 0,
        communicationScore: 0,
        behavioralScore: 0,
        strengths: ["Unable to generate detailed analysis — Granite unavailable"],
        weaknesses: [],
        questionObservations: [],
        skillGaps: skillMatch?.missingSkills ?? [],
        improvementRecommendations: ["Please review the interview transcript manually"],
        learningRoadmap: [],
      };
    }

    const report = {
      id: generateId(),
      sessionId,
      candidateId,
      targetRole,
      overallScore: reportData.overallScore,
      technicalScore: reportData.technicalScore,
      communicationScore: reportData.communicationScore,
      behavioralScore: reportData.behavioralScore,
      strengths: reportData.strengths,
      weaknesses: reportData.weaknesses,
      questionObservations: reportData.questionObservations,
      skillGaps: reportData.skillGaps,
      improvementRecommendations: reportData.improvementRecommendations,
      learningRoadmap: reportData.learningRoadmap,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: { report } });
  } catch (err) {
    console.error("[/api/interview/end]", err);
    if (err instanceof IbmAuthError) {
      return NextResponse.json(
        { success: false, error: { code: "IBM_AUTH_ERROR", message: "IBM authentication failed." } },
        { status: 503 },
      );
    }
    if (err instanceof GraniteError) {
      return NextResponse.json(
        { success: false, error: { code: "GRANITE_ERROR", message: err.message } },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to generate report." } },
      { status: 500 },
    );
  }
}
