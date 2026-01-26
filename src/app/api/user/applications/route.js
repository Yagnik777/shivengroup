import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });

    await connectMongo();

    const userEmail = session.user.email;
    const applications = await Application.find({ email: userEmail })
      .populate("job", "title jobCategory type experienceLevel")
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Fix case-sensitive comparison
    const summary = {
      total: applications.length,
      approved: applications.filter(a => a.status?.toLowerCase() === "approved").length,
      pending: applications.filter(a => a.status?.toLowerCase() === "pending").length,
      rejected: applications.filter(a => a.status?.toLowerCase() === "rejected").length,
    };

    return new Response(JSON.stringify({ applications, ...summary }), { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching user applications:", error);
    return new Response(JSON.stringify({ message: "Server error", error: error.message }), {
      status: 500,
    });
  }
}
