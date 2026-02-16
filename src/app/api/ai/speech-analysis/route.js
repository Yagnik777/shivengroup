import { NextResponse } from "next/server";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Extract text safely from different Gemini response formats
function extractText(data) {
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    data?.candidates?.[0]?.content?.[0]?.text ||
    data?.candidates?.[0]?.text ||
    null
  );
}

export async function POST(req) {
  try {
    const { text } = await req.json();

    const prompt = `
Analyze the following spoken answer for tone and delivery.
Give feedback in 3–5 sentences.

Rules:
- Keep feedback short and practical.
- Evaluate clarity, confidence, pacing, and communication style.
- Give actionable tips to improve.
- Do NOT generate long sections or headings.

User Speech: "${text}"
`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    

    const analysis = extractText(data);

    if (!analysis) {
      return NextResponse.json({
        analysis:
          "⚠️ Gemini did not return text. Try again or refine the input.",
      });
    }

    return NextResponse.json({ analysis });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
