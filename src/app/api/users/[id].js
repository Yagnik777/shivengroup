// /api/users/[id].js
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
export const dynamic = "force-dynamic";

export default async function handler(req, res) {
  await connectMongo();

  const { id } = req.query;

  if (req.method === "DELETE") {
    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted" });
  }

  res.status(405).json({ error: "Method not allowed" });
}
