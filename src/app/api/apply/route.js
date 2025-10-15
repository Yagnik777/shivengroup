// src/app/api/apply/route.js
import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectMongo();

    // Get logged-in user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(
        JSON.stringify({ message: "You must be logged in to apply" }),
        { status: 401 }
      );
    }

    const { jobId, pricing, timeRequired, additionalInfo } = await req.json();

    // Validate required fields
    if (!jobId || !pricing || !timeRequired || !additionalInfo) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const app = await Application.create({
      jobId,
      pricing,
      timeRequired,
      additionalInfo,
      email: session.user.email, // auto-fill email from logged-in user
      name: session.user.name,   // auto-fill name from logged-in user
      candidateId: session.user.id || null, // optional: link to user ID if you store it
    });

    return new Response(
      JSON.stringify({ message: "Application submitted", app }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to save application:", err);
    return new Response(
      JSON.stringify({ message: "Failed to save application" }),
      { status: 500 }
    );
  }
}