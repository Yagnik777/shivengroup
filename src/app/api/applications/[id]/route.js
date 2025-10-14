import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectMongo();
    const parts = req.url.split("/");
    const id = parts[parts.length - 1];
    const app = await Application.findById(id).lean();
    if (!app) return new Response("Not found", { status: 404 });
    return new Response(JSON.stringify(app), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed", { status: 500 });
  }
}
