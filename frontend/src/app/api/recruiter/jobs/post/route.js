import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Job from "@/models/Job";
import Company from "@/models/Company";

// ✅ GET: Fetch all jobs for a recruiter
export async function GET(req) {
  try {
    await connectMongo();
    const recruiterId = "TEMP_RECRUITER_ID"; // Replace with session logic
    const jobs = await Job.find({ recruiterId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, jobs: jobs || [] });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// ✅ POST: Create new job
export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const recruiterId = "TEMP_RECRUITER_ID";

    const company = await Company.findOne({ recruiterId });
    if (!company) return NextResponse.json({ error: "Company profile not found" }, { status: 400 });

    const skillsArray = body.requirements ? body.requirements.split(",").map(s => s.trim()) : [];

    const newJob = await Job.create({
      ...body,
      skills: skillsArray,
      deadline: new Date(body.deadline),
      recruiterId,
      companyId: company._id,
    });

    return NextResponse.json({ success: true, job: newJob }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT: Update existing job
export async function PUT(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const { jobId, ...updateData } = body;

    if (updateData.requirements) {
      updateData.skills = updateData.requirements.split(",").map(s => s.trim());
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true });
    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE: Remove a job
export async function DELETE(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

    await Job.findByIdAndDelete(jobId);
    return NextResponse.json({ success: true, message: "Job deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}