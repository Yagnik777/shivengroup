import connectMongo from "@/lib/mongodb";
import Dropdown from "@/models/Dropdown";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req, { params }) {
  try {
    await connectMongo();
    const { id } = params;
    await Dropdown.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete dropdown" }, { status: 500 });
  }
}
