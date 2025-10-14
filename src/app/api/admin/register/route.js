// shivengroup-frontend/src/app/api/admin/register/route.js
export const dynamic = "force-dynamic";

import connectMongo from "@/lib/mongodb";
import Admin from "@/models/Admin"; // Make sure Admin model uses mongoose.models.Admin || mongoose.model(...)
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectMongo(); // Connect to MongoDB at runtime

    const { name, email, password } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return new Response(
        JSON.stringify({ message: "Email already exists" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save admin
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    return new Response(
      JSON.stringify({ message: "Admin registered successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin register error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
