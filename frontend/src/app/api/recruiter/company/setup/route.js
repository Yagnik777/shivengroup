//src/app/api/recruiter/company/setup/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Company from "@/models/Company";

export async function POST(req) {
  try {
    await connectMongo();

    const body = await req.json();
    const { 
      name, 
      tagline, 
      industry, 
      website, 
      email,    // નવું ઉમેર્યું
      phone,    // નવું ઉમેર્યું
      address,  // location ની જગ્યાએ address
      companySize, 
      founded, 
      description, 
      specialties 
    } = body;

    // 1. Validation
    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const recruiterId = "TEMP_RECRUITER_ID"; 

    // 3. Update if exists, otherwise Create (Upsert)
    const updatedCompany = await Company.findOneAndUpdate(
      { recruiterId: recruiterId },
      {
        name,
        tagline,
        industry,
        website,
        email,    // નવું ઉમેર્યું
        phone,    // નવું ઉમેર્યું
        address,  // location ની જગ્યાએ address
        companySize,
        founded,
        description,
        specialties, 
      },
      { new: true, upsert: true } 
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

export async function GET(req) {
  try {
    await connectMongo();
    const recruiterId = "TEMP_RECRUITER_ID"; 

    const company = await Company.findOne({ recruiterId });
    
    if (!company) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: company });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}