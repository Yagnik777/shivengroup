export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Company from "@/models/Company";

// Note: I assume you have a way to get the current user's ID (e.g., from a cookie or session)
// For now, I'll include a placeholder for recruiterId.

export async function POST(req) {
  try {
    await connectMongo();

    const body = await req.json();
    const { 
      name, 
      tagline, 
      industry, 
      website, 
      location, 
      companySize, 
      founded, 
      description, 
      specialties 
    } = body;

    // 1. Validation
    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    // 2. Mocking a Recruiter ID (In production, get this from auth session/token)
    // const session = await getServerSession(authOptions);
    // const recruiterId = session.user.id;
    const recruiterId = "TEMP_RECRUITER_ID"; 

    // 3. Update if exists, otherwise Create (Upsert)
    // This ensures a recruiter only has one company profile
    const updatedCompany = await Company.findOneAndUpdate(
      { recruiterId: recruiterId },
      {
        name,
        tagline,
        industry,
        website,
        location,
        companySize,
        founded,
        description,
        specialties, // Stored as a string or array depending on your preference
      },
      { new: true, upsert: true } // Create if doesn't exist
    );

    return NextResponse.json({ 
      ok: true, 
      message: "Profile updated successfully", 
      data: updatedCompany 
    });

  } catch (err) {
    console.error("COMPANY_SETUP_ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Optional: GET route to fetch the profile data for the edit page
export async function GET(req) {
  try {
    await connectMongo();
    const recruiterId = "TEMP_RECRUITER_ID"; // Replace with real auth ID

    const company = await Company.findOne({ recruiterId });
    
    if (!company) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: company });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}