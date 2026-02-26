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
      email, 
      phone, 
      address, 
      companySize, 
      founded, 
      description, 
      specialties,
      logo // લોગો પણ સેવ થશે
    } = body;

    // અહીં તમારી રજીસ્ટ્રેશન વાળી Recruiter/User ID આવશે
    // અત્યારે TEMP છે, પણ તે રજીસ્ટર થયેલા ડેટાને જ શોધશે
    const recruiterId = "TEMP_RECRUITER_ID"; 

    // રજીસ્ટ્રેશન વખતે જે કંપની બની હોય તેને જ શોધીને અપડેટ કરશે
    const updatedCompany = await Company.findOneAndUpdate(
      { recruiterId: recruiterId },
      {
        name,
        tagline,
        industry,
        website,
        email,
        phone,
        address,
        companySize,
        founded,
        description,
        specialties,
        logo 
      },
      { new: true } // અહીં upsert કાઢી નાખ્યું છે જેથી ફક્ત રજીસ્ટર થયેલી કંપની જ અપડેટ થાય
    );

    if (!updatedCompany) {
      return NextResponse.json({ error: "Company not found. Please register first." }, { status: 404 });
    }

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