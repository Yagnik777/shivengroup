// src/app/api/applications/route.js
import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectMongo();
    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");
    const email = url.searchParams.get("email");

    const filter = {};
    if (jobId) filter.jobId = jobId;
    if (email) filter.email = email;

    const list = await Application.find(filter).sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify(list), { status: 200 });
  } catch (err) {
    console.error("GET /api/applications error:", err);
    return new Response(JSON.stringify({ message: "Failed to fetch applications" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();

    // require authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ message: "You must be logged in to apply" }), { status: 401 });
    }

    const body = await req.json();
    const { jobId, pricing, timeRequired, additionalInfo, coverLetter, phone } = body;

    if (!jobId || !pricing || !timeRequired || !additionalInfo) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    // prevent duplicate apply by same email for same job (optional)
    const existing = await Application.findOne({ jobId, email: session.user.email });
    if (existing) {
      return new Response(JSON.stringify({ message: "You have already applied for this job" }), { status: 409 });
    }

    const app = await Application.create({
      jobId,
      pricing,
      timeRequired,
      additionalInfo,
      coverLetter: coverLetter || "",
      phone: phone || "",
      email: session.user.email,
      name: session.user.name || "",
      candidateId: session.user.id || null,
    });

    return new Response(JSON.stringify({ message: "Application submitted", app }), { status: 201 });
  } catch (err) {
    console.error("POST /api/applications error:", err);
    return new Response(JSON.stringify({ message: "Failed to save application" }), { status: 500 });
  }
}
