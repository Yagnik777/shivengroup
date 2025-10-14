// src/app/api/candidates/[id]/route.js
import connectMongo from "@/lib/mongodb";
import Candidate from "@/models/Candidate";

export const dynamic = "force-dynamic";

function getIdFromUrl(req) {
  const parts = new URL(req.url).pathname.split("/");
  return parts[parts.length - 1];
}

export async function GET(req) {
  try {
    await connectMongo();
    const id = getIdFromUrl(req);
    const cand = await Candidate.findById(id).lean();
    if (!cand) return new Response("Not found", { status: 404 });
    return new Response(JSON.stringify(cand), { status: 200 });
  } catch (err) {
    console.error("GET /api/candidates/[id] error:", err);
    return new Response("Failed", { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectMongo();
    const id = getIdFromUrl(req);
    const body = await req.json();
    const cand = await Candidate.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!cand) return new Response("Not found", { status: 404 });
    return new Response(JSON.stringify(cand), { status: 200 });
  } catch (err) {
    console.error("PUT /api/candidates/[id] error:", err);
    return new Response("Failed to update", { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectMongo();
    const id = getIdFromUrl(req);
    await Candidate.findByIdAndDelete(id);
    return new Response("Deleted", { status: 200 });
  } catch (err) {
    console.error("DELETE /api/candidates/[id] error:", err);
    return new Response("Failed to delete", { status: 500 });
  }
}
