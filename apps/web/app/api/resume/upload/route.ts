// ============================================================
// InterviewIQ — BFF: Resume Upload + Text Extraction
// POST /api/resume/upload
// Accepts: multipart/form-data with field "file" (PDF or TXT)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { RESUME_CONFIG } from "@/config/app.config";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Expected multipart/form-data" } },
        { status: 400 },
      );
    }

    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, error: { code: "NO_FILE", message: "No file uploaded. Please select a PDF or TXT file." } },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > RESUME_CONFIG.maxSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FILE_TOO_LARGE",
            message: `File is too large. Maximum size is ${RESUME_CONFIG.maxSizeMb}MB.`,
          },
        },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { success: false, error: { code: "EMPTY_FILE", message: "The uploaded file is empty." } },
        { status: 400 },
      );
    }

    const fileName = file.name || "resume";
    const fileExt = fileName.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = file.type;

    // Validate format
    if (!["pdf", "txt"].includes(fileExt) && !mimeType.includes("pdf") && !mimeType.includes("text")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNSUPPORTED_FORMAT",
            message: "Unsupported file format. Please upload a PDF or TXT file.",
          },
        },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    if (fileExt === "txt" || mimeType.includes("text/plain")) {
      extractedText = buffer.toString("utf-8").trim();
    } else {
      // PDF extraction
      try {
        const pdfParse = (await import("pdf-parse")).default;
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text?.trim() ?? "";
      } catch (pdfErr) {
        console.error("[resume/upload] PDF parse error:", pdfErr);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PDF_PARSE_FAILED",
              message: "Could not extract text from this PDF. Please ensure it is a text-based PDF (not scanned image).",
            },
          },
          { status: 422 },
        );
      }
    }

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INSUFFICIENT_TEXT",
            message: "Could not extract enough text from the file. Please ensure the file contains readable text.",
          },
        },
        { status: 422 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        fileName,
        fileSizeBytes: file.size,
        extractedText,
        charCount: extractedText.length,
      },
    });
  } catch (err) {
    console.error("[/api/resume/upload]", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Resume upload failed. Please try again." } },
      { status: 500 },
    );
  }
}
