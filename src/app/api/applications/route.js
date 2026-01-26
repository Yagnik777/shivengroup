import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const config = { api: { bodyParser: false } };

// ---------------- POST - Submit new application ----------------
export async function POST(req) {
  try {
    await connectMongo();
    


    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Login required" }, { status: 401 });
    }

    const formData = await req.formData();

    const jobId = formData.get("jobId");
    const resumeFile = formData.get("resume");
    const price = Number(formData.get("pricing"));
    const estimatedDays = Number(formData.get("timeRequired"));
    const coverLetter = formData.get("additionalInfo");
    const phone = formData.get("phone") || "";
    const linkedIn = formData.get("linkedIn") || "";
    const portfolio = formData.get("portfolio") || "";

    if (!jobId || !resumeFile || isNaN(price) || isNaN(estimatedDays) || !coverLetter) {
      return NextResponse.json({ message: "Missing required fields or resume" }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ message: "Job not found" }, { status: 404 });

    const exists = await Application.findOne({ job: jobId, candidate: session.user.id });
    if (exists) return NextResponse.json({ message: "Already applied" }, { status: 400 });

    // Save resume directly to /public folder
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

    const fileName = `${Date.now()}-${resumeFile.name}`;
    const filePath = path.join(publicDir, fileName);
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const attachment = {
      name: resumeFile.name,
      url: `/${fileName}`, // ✅ Saved directly in /public
      type: resumeFile.type,
    };

    const app = await Application.create({
      job: job._id,
      candidate: session.user.id,
      name: session.user.name,
      email: session.user.email,
      phone,
      linkedIn,
      portfolio,
      price,
      estimatedDays,
      coverLetter,
      attachments: [attachment],
      jobCategory: job.jobCategory,
      jobType: job.type,
      experienceLevel: job.experienceLevel,
      status: "pending",
    });

    return NextResponse.json({ message: "Application submitted", application: app }, { status: 201 });
  } catch (err) {
    console.error("Error saving application:", err);
    return NextResponse.json({ message: "Failed to submit application", error: err.message }, { status: 500 });
  }
}

// ---------------- GET - Fetch all applications ----------------
export async function GET() {
  try {
    await connectMongo();
    const applications = await Application.find()
      .populate("job", "title jobCategory type experienceLevel")
      .sort({ createdAt: -1 });

    return NextResponse.json(applications || [], { status: 200 });
  } catch (err) {
    console.error("Error fetching applications:", err);
    return NextResponse.json({ message: "Failed to fetch applications", error: err.message }, { status: 500 });
  }
}
