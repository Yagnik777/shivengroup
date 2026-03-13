import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Job from "@/models/Job"; // તમારું Job મોડેલ
import Application from "@/models/Application";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recruiterId = session.user.id;

    // 1. બધી જોબ્સ શોધો જે આ રિક્રુટરની છે
    const jobs = await Job.find({ recruiterId }).sort({ createdAt: -1 });
    
    // 2. આ રિક્રુટરની જોબ્સ પર આવેલી કુલ એપ્લિકેશન્સ ગણો
    const appsCount = await Application.countDocuments({ recruiterId });

    // 3. પેન્ડિંગ એપ્લિકેશન્સ ગણો
    const pendingCount = await Application.countDocuments({ 
      recruiterId, 
      status: { $regex: /pending/i } 
    });

    return NextResponse.json({
      success: true,
      stats: {
        jobsCount: jobs.length,
        appsCount: appsCount,
        pendingCount: pendingCount,
        hiredCount: await Application.countDocuments({ recruiterId, status: { $regex: /approved/i } })
      },
      recentJobs: jobs.slice(0, 5), // છેલ્લી 5 જોબ્સ
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}