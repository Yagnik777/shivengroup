import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectMongo();
    const url = new URL(req.url);
    // optional filtering by jobId or email
    const jobId = url.searchParams.get("jobId");
    const email = url.searchParams.get("email");

    const filter = {};
    if (jobId) filter.jobId = jobId;
    if (email) filter.email = email;

    const list = await Application.find(filter).sort({ createdAt: -1 }).lean();
    return new Response(JSON.stringify(list), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch applications", { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    // required fields: jobId + name + email
    if (!body.jobId || !body.email || !body.name) {
      return new Response("Missing fields", { status: 400 });
    }
    const app = await Application.create(body);
    return new Response(JSON.stringify(app), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to save application", { status: 500 });
  }
}
