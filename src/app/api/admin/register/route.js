export const dynamic = 'force-dynamic';

import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectMongo();
    const { name, email, password } = await req.json();
    if (!name || !email || !password)
      return new Response(JSON.stringify({ message: "All fields required" }), { status: 400 });

    const existing = await Admin.findOne({ email });
    if (existing)
      return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    return new Response(JSON.stringify({ message: "Admin registered successfully" }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
