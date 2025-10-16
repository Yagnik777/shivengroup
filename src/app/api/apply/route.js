import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectMongo();

    // ✅ Check user login
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(
        JSON.stringify({ message: "You must be logged in to apply" }),
        { status: 401 }
      );
    }

    // ✅ Get form data
    const { jobId, pricing, timeRequired, additionalInfo } = await req.json();

    if (!jobId || !pricing || !timeRequired || !additionalInfo) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // ✅ Save in database
    const app = await Application.create({
      jobId,
      pricing,
      timeRequired,
      additionalInfo,
      email: session.user.email,
      name: session.user.name,
      candidateId: session.user.id || null,
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
