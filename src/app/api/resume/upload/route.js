export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Resume from "@/models/Resume";
import mammoth from "mammoth";
import { analyzeResumeGemini } from "@/lib/gemini";

// -----------------------------
// PDF Parsing
// -----------------------------
async function extractPDF(buffer) {
  try {
    const pdfParse = require("pdf-parse").default || require("pdf-parse");
    const data = await pdfParse(buffer);
    return data.text?.trim() || "";
  } catch (err) {
    console.warn("PDF parsing failed:", err);
    return "";
  }
}

// -----------------------------
// DOCX Parsing
// -----------------------------
async function extractDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value?.trim() || "";
  } catch (err) {
    console.warn("DOCX parsing failed:", err);
    return "";
  }
}

// -----------------------------
// Generic text extraction
// -----------------------------
async function extractText(buffer, filename) {
  const ext = filename.split(".").pop().toLowerCase();

  let text = "";
  if (ext === "pdf") text = await extractPDF(buffer);
  else if (ext === "docx") text = await extractDOCX(buffer);
  else text = buffer.toString("utf-8");

  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// -----------------------------
// ATS Calculation
// -----------------------------
function calculateATS(resumeText, jobDescription) {
  if (!jobDescription || !jobDescription.trim())
    return { score: 0, missingKeywords: [] };

  const resumeWords = new Set(
    resumeText.toLowerCase().split(/\W+/).filter(Boolean)
  );
  const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(Boolean);

  const missingKeywords = jdWords.filter((w) => !resumeWords.has(w));

  const score = Math.max(
    0,
    Math.min(100, 100 - (missingKeywords.length / jdWords.length) * 100)
  );

  return { score: Math.round(score), missingKeywords };
}

// -----------------------------
// POST Route
// -----------------------------
export async function POST(req) {
  try {
    await connectMongo();

    const form = await req.formData();
    const file = form.get("file");
    const userId = form.get("userId") || null;
    const jobDescription = form.get("jobDescription") || "";

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractText(buffer, file.name);

    if (!text)
      return NextResponse.json(
        {
          error:
            "Unable to extract text. Upload a text-based PDF, DOCX, or TXT.",
        },
        { status: 400 }
      );

    // -----------------------------
    // Gemini AI Analysis
    // -----------------------------
    const aiSuggestions = await analyzeResumeGemini(text);

    // -----------------------------
    // ATS Score
    // -----------------------------
    const atsResult = calculateATS(text, jobDescription);

    // -----------------------------
    // Save to DB
    // -----------------------------
    const saved = await Resume.create({
      userId,
      originalName: file.name,
      text,
      aiSuggestions,
      atsScore: atsResult.score,
      missingKeywords: atsResult.missingKeywords,
    });

    return NextResponse.json({ ok: true, data: saved });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
