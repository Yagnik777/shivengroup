import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import CandidateJob from "@/models/CandidateJob";

export async function GET() {
  try {
    await connectMongo();
    // postedAt: -1 થી નવી જોબ સૌથી પહેલા દેખાશે
    const jobs = await CandidateJob.find({}).sort({ postedAt: -1 });
    return NextResponse.json(jobs);
  } catch (err) {
    console.error("FETCH_ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();

    // ડેટા સેવ કરતા પહેલા ખાતરી કરો કે title ખાલી નથી
    if (!body.title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const newJob = await CandidateJob.create({
      ...body, // આમાં title, category, location વગેરે ઓટોમેટિક આવી જશે
      status: "published",
      isActive: true,
      postedAt: new Date()
    });

    return NextResponse.json({ message: "Job saved successfully!", data: newJob }, { status: 201 });
  } catch (err) {
    console.error("SAVE_ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}