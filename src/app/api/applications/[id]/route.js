import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectMongo();
    const { id } = params;
    const { status } = await req.json();

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const app = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!app) return NextResponse.json({ message: "Application not found" }, { status: 404 });

    return NextResponse.json({ message: "Status updated", application: app }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Failed to update status", error: err.message }, { status: 500 });
  }
}
