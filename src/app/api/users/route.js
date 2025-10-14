import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectMongo();
    const users = await User.find();
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Failed to fetch users", { status: 500 });
  }
}
