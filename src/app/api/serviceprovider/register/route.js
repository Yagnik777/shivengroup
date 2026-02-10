export const dynamic = "force-dynamic";

import connectMongo from "@/lib/mongodb";
import ServiceProvider from "@/models/serviceprovider";
import OTP from "@/models/EmailOTP"; 
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongo();

    const body = await req.json().catch(() => ({}));
    const { 
      action, email, otp, password, fullName, username, 
      mobile, providerName, serviceCategory, location 
    } = body;

    /* --------------------------------------------------------
        1️⃣ ACTION → SEND OTP
    -------------------------------------------------------- */
    if (action === "send-otp") {
      if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

      // જૂના OTP કાઢી નાખો
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

    /* --------------------------------------------------------
        2️⃣ ACTION → VERIFY OTP (અહીં જ ફેરફાર છે)
    -------------------------------------------------------- */
    if (action === "verify-otp") {
      if (!email || !otp) return NextResponse.json({ error: "Email & OTP are required" }, { status: 400 });

      // અહીં આપણે ServiceProvider.findOne() નથી કરવાનું, કારણ કે તે હજુ બન્યો જ નથી!
      // ફક્ત OTP ટેબલમાં ચેક કરો
      const record = await OTP.findOne({ email }).sort({ createdAt: -1 });

      if (!record || record.otp !== otp)
        return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });

      if (record.expiresAt < new Date())
        return NextResponse.json({ error: "OTP has expired" }, { status: 400 });

      // જો બધું સાચું હોય તો સીધું રિટર્ન કરો
      return NextResponse.json({ message: "OTP verified successfully!" });
    }

    /* --------------------------------------------------------
        3️⃣ ACTION → REGISTER (ફાઈનલ ડેટાબેઝ એન્ટ્રી)
    -------------------------------------------------------- */
    if (action === "register") {
      if (!fullName || !email || !password || !username) {
        return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
      }

      // અહીં ચેક કરો કે ઈમેઈલ કે યુઝરનેમ પહેલેથી કોઈએ વાપર્યું તો નથી ને?
      const existing = await ServiceProvider.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        return NextResponse.json({ error: "Email or Username already exists" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // હવે ડેટાબેઝમાં સેવ કરો
      await ServiceProvider.create({
        fullName,
        username,
        email,
        mobile,
        providerName,
        serviceCategory,
        location,
        password: hashedPassword,
        isVerified: true,
        role: "service_provider",
      });

      // કામ પતી ગયું એટલે OTP ડીલીટ કરી નાખો
      await OTP.deleteMany({ email });

      return NextResponse.json({ message: "Service Provider registered successfully!" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    // આ JSON રિસ્પોન્સ પેલી 'Unexpected token E' વાળી ભૂલ અટકાવશે
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}