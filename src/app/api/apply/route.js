// src/app/api/apply/route.js
export const dynamic = "force-dynamic";

import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";

export async function POST(req) {
  try {
    await connectMongo();
    const data = await req.json();
    const { jobId, fullName, email, phone, resumeUrl, coverLetter } = data;

    if (!jobId || !fullName || !email) {
      return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
    }

    const app = new Application({ jobId, fullName, email, phone, resumeUrl, coverLetter });
    await app.save();

    return new Response(JSON.stringify({ message: "Application submitted" }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
