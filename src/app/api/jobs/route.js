import connectMongo from "@/lib/mongodb";
import Job from "@/models/Job";

export const dynamic = "force-dynamic";

// GET jobs
export async function GET(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const exp = searchParams.get("experienceLevel");

    const filter = {};
    if (type && type !== "All") filter.type = type;
    if (exp && exp !== "All") filter.experienceLevel = exp;

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}

// POST job
export async function POST(req) {
  try {
    await connectMongo();
    const data = await req.json();
    const job = await Job.create(data);
    return new Response(JSON.stringify(job), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to create job" }), { status: 500 });
  }
}

// PUT job
export async function PUT(req) {
  try {
    await connectMongo();
    const { id, ...data } = await req.json();
    const job = await Job.findByIdAndUpdate(id, data, { new: true });
    return new Response(JSON.stringify(job), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to update job" }), { status: 500 });
  }
}

// DELETE job
export async function DELETE(req) {
  try {
    await connectMongo();
    const { id } = await req.json();
    await Job.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Deleted" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Failed to delete job" }), { status: 500 });
  }
}
