import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  await connectMongo();
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = jwt.sign({ id: admin._id, name: admin.name, email: admin.email }, JWT_SECRET);

  const res = NextResponse.json({ ok: true });
  // ✅ Session cookie → tab close / browser close par expire
  res.headers.append(
    "Set-Cookie",
    `token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`
  );
  return res;
}
