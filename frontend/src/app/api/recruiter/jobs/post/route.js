import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Job from "@/models/Job";
import Company from "@/models/Company";

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();

    // 1. Get Recruiter ID (Auth logic)
    const recruiterId = "TEMP_RECRUITER_ID"; 

    // 2. Find the Company
    const company = await Company.findOne({ recruiterId });
    if (!company) {
      return NextResponse.json(
        { error: "Please setup your Company Profile first." },
        { status: 400 }
      );
    }

    // 3. Mandatory Fields Check (To avoid Mongoose Errors)
    if (!body.title || !body.deadline || !body.experienceLevel) {
        return NextResponse.json(
            { error: "Title, Deadline, and Experience Level are required fields." },
            { status: 400 }
        );
    }

    // 4. Format Requirements/Skills (String to Array)
    const skillsArray = body.requirements 
      ? body.requirements.split(",").map(skill => skill.trim()) 
      : [];

    // 5. Create Job Post with exact fields matching your Model
    const newJob = await Job.create({
      title: body.title,
      category: body.category,
      jobType: body.jobType,
      location: body.location,
      salaryRange: body.salaryRange,
      experienceLevel: body.experienceLevel, // Fixed
      description: body.description,
      deadline: new Date(body.deadline), // Fixed: String to Date Object
      skills: skillsArray,
      recruiterId: recruiterId,
      companyId: company._id,
      status: "active"
    });

    return NextResponse.json({ 
      success: true, 
      message: "Job posted successfully!", 
      job: newJob 
    });

  } catch (error) {
    console.error("JOB_POST_ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}