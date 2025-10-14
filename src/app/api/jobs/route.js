export const dynamic = "force-dynamic";
import connectMongo from "@/lib/mongodb"; // ✅ correct function
import Job from "@/models/Job";

// ✅ Get all jobs + filters
export async function GET(req) {
  await connectMongo();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const experienceLevel = searchParams.get("experienceLevel");

  let filter = {};
  if (type && type !== "All") filter.type = type;
  if (experienceLevel && experienceLevel !== "All") filter.experienceLevel = experienceLevel;

  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  return new Response(JSON.stringify(jobs), { status: 200 });
}

// ✅ Add job
export async function POST(req) {
  await connectMongo(); // ✅ use correct function
  const data = await req.json();
  const job = await Job.create(data);
  return new Response(JSON.stringify(job), { status: 201 });
}

// ✅ Update job
export async function PUT(req) {
  await connectMongo();
  const { id, ...data } = await req.json();
  const job = await Job.findByIdAndUpdate(id, data, { new: true });
  return new Response(JSON.stringify(job), { status: 200 });
}

// ✅ Delete job
export async function DELETE(req) {
  await connectMongo();
  const { id } = await req.json();
  await Job.findByIdAndDelete(id);
  return new Response("Deleted", { status: 200 });
}
