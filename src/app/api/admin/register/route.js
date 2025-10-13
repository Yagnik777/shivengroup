import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin"; // Create Admin schema similar to User
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectMongo();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ message: "All fields are required" }), { status: 400 });
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({ name, email, password: hashedPassword });
  await admin.save();

  return new Response(JSON.stringify({ message: "Admin registered successfully" }), { status: 201 });
}
