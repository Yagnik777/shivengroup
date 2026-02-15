export const dynamic = "force-dynamic";

import connectMongo from "@/lib/mongodb";
import ServiceProvider from "@/models/serviceprovider";
import OTP from "@/models/EmailOTP"; 
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* --------------------------------------------------------
    1️⃣ GET: પ્રોફાઇલ ડિસ્પ્લે કરવા માટે
-------------------------------------------------------- */
export async function GET(req) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "તમે લોગિન કરેલ નથી" }, { status: 401 });
    }

    const email = session.user.email; 
    const user = await ServiceProvider.findOne({ email }).select("-password");

    if (!user) {
      return NextResponse.json({ success: false, error: "પ્રોવાઈડર મળ્યો નથી" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/* --------------------------------------------------------
    2️⃣ PUT: પ્રોફાઇલ અપડેટ કરવા માટે
-------------------------------------------------------- */
export async function PUT(req) {
  try {
    await connectMongo();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, providerName, serviceCategory, experience, location, mobile } = body;
    const email = session.user.email;

    const updatedUser = await ServiceProvider.findOneAndUpdate(
      { email: email },
      { 
        $set: { 
          fullName, 
          providerName, 
          serviceCategory, 
          experience, 
          location, 
          mobile 
        } 
      },
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("PUT PROFILE ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* --------------------------------------------------------
    3️⃣ POST: રજીસ્ટ્રેશન, OTP સેન્ડ અને વેરિફિકેશન માટે
-------------------------------------------------------- */
export async function POST(req) {
  try {
    await connectMongo();

    const body = await req.json().catch(() => ({}));
    const { 
      action, email, otp, password, fullName, username, 
      mobile, providerName, serviceCategory, location,
      experience 
    } = body;

    // --- A. SEND OTP ---
    if (action === "send-otp") {
      if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

      await OTP.deleteMany({ email });
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

      await OTP.create({ email, otp: otpCode, expiresAt });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Shiven Jobs" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verification Code",
        html: `<h2>Your OTP: ${otpCode}</h2>`
      });

      return NextResponse.json({ message: "OTP sent successfully!" });
    }

    // --- B. VERIFY OTP ---
    if (action === "verify-otp") {
      if (!email || !otp) return NextResponse.json({ error: "Email & OTP are required" }, { status: 400 });

      const record = await OTP.findOne({ email }).sort({ createdAt: -1 });

      if (!record || record.otp !== otp)
        return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });

      if (record.expiresAt < new Date())
        return NextResponse.json({ error: "OTP has expired" }, { status: 400 });

      return NextResponse.json({ message: "OTP verified successfully!" });
    }

    // --- C. REGISTER ---
    if (action === "register") {
      if (!fullName || !email || !password || !username) {
        return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
      }

      const existing = await ServiceProvider.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        return NextResponse.json({ error: "Email or Username already exists" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await ServiceProvider.create({
        fullName,
        username,
        email,
        mobile,
        providerName,
        serviceCategory,
        location,
        experience, 
        password: hashedPassword,
        isVerified: true,
        role: "service_provider",
      });

      await OTP.deleteMany({ email });
      return NextResponse.json({ message: "Service Provider registered successfully!" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}