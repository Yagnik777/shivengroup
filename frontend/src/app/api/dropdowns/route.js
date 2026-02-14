import connectMongo from "@/lib/mongodb";
import Dropdown from "@/models/Dropdown";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ✅ GET all dropdowns
export async function GET() {
  try {
    await connectMongo();
    const data = await Dropdown.find().lean();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dropdowns" }, { status: 500 });
  }
}

// ✅ POST new dropdown value
export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const { type, value } = body;

    if (!type || !value) {
      return NextResponse.json({ error: "Type and value are required" }, { status: 400 });
    }

    const existing = await Dropdown.findOne({ type, value });
    if (existing) {
      return NextResponse.json({ error: "Already exists" }, { status: 400 });
    }

    const newItem = await Dropdown.create({ type, value });
    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Dropdown POST Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add dropdown" },
      { status: 500 }
    );
  }
}
