import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";
import Candidate from "@/models/Candidate";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. POST: યુઝર જ્યારે એપ્લાય કરે (Candidate પ્રોફાઇલમાંથી ડેટા ખેંચીને)
export async function POST(req) {
  try {
    await connectMongo();
    
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, recruiterId, role } = body;

    const userProfile = await Candidate.findOne({ userId: session.user.id });

    if (!userProfile) {
      return NextResponse.json({ 
        error: "તમારી પ્રોફાઇલ અધૂરી છે. પહેલા Profile પેજ પર જઈને વિગતો ભરો!" 
      }, { status: 400 });
    }

    // Creating Application with correct mapping
    const newApp = await Application.create({
      jobId,
      recruiterId,
      name: userProfile.fullName,       // Maps Candidate.fullName -> Application.name
      email: userProfile.email,   
      role: role,                 
      resumeUrl: userProfile.resume,    // Maps Candidate.resume -> Application.resumeUrl
      mobile: userProfile.mobile,   
      city: userProfile.city,       
      state: userProfile.state,
      profession: userProfile.profession,
      
      // Education
      graduationUniversity: userProfile.graduationUniversity,
      graduationSpecialization: userProfile.graduationSpecialization,
      graduationPercentage: userProfile.graduationPercentage,
      classXIIPercentage: userProfile.classXIIPercentage,
      classXPercentage: userProfile.classXPercentage,
      
      // Work Experience
      presentEmploymentStatus: userProfile.presentEmploymentStatus,
      currentCompanyName: userProfile.currentCompanyName,
      jobDepartment: userProfile.jobDepartment,
      jobIndustry: userProfile.jobIndustry,
      jobDescription: userProfile.jobDescription,
      jobFromDate: userProfile.jobFromDate,
      jobToDate: userProfile.jobToDate,
      
      // Skills & Socials
      skills: userProfile.skills,
      github: userProfile.github,
      portfolio: userProfile.portfolio,

      status: "Pending", 
      appliedAt: new Date(),
      userId: session.user.id
    });

    return NextResponse.json({ ok: true, data: newApp });
  } catch (err) {
    console.error("Apply Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. GET: રિક્રુટર માટે બધા જ કેન્ડિડેટ્સનું લિસ્ટ મેળવવા
// 2. GET: ફક્ત જે-તે રિક્રુટર માટેના જ કેન્ડિડેટ્સનું લિસ્ટ મેળવવા
export async function GET(req) {
  try {
    await connectMongo();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let apps;
    if (session.user.role === "recruiter") {
      apps = await Application.find({ recruiterId: session.user.id }).sort({ appliedAt: -1 });
    } else {
      // અહીં ફેરફાર: ઈમેલને Case-insensitive શોધવા માટે Regex વાપરીએ
      const userEmail = session.user.email;
      // Removed sensitive logging
      // console.log("Fetching apps for email:", userEmail);
      console.log("Fetching apps for authenticated user");
      
      apps = await Application.find({
        $or: [
          { email: userEmail.toLowerCase() },
          { userId: session.user.id }
        ]
      }).collation({ locale: "en", strength: 2 }).sort({ appliedAt: -1 });
    }

    return NextResponse.json({ ok: true, data: apps || [] });
  } catch (err) {
    console.error("Fetch Error:", err);
    return NextResponse.json({ ok: false, data: [] }, { status: 500 });
  }
}

// 3. PATCH: રિક્રુટર જ્યારે Approve કે Reject બટન દબાવે
export async function PATCH(req) {
  try {
    await connectMongo();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing ID or Status" }, { status: 400 });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id, 
      { status: status }, 
      { new: true }
    );

    return NextResponse.json({ ok: true, data: updatedApp });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
// app/api/applications/route.js

export async function DELETE(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
    }

    await Application.findByIdAndDelete(id);
    return NextResponse.json({ ok: true, message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}