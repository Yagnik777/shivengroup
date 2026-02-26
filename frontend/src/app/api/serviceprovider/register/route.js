// src/app/api/serviceprovider/register/route.js
export const dynamic = "force-dynamic";
import connectMongo from "@/lib/mongodb";
import ServiceProvider from "@/models/serviceprovider";
import OTP from "@/models/EmailOTP"; 
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function GET(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    const user = await ServiceProvider.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, user });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();
    const contentType = req.headers.get("content-type") || "";
    let action, email, data;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      action = formData.get("action");
      email = formData.get("email");
      data = formData; 
    } else {
      const json = await req.json();
      action = json.action;
      email = json.email;
      data = json;
    }

    if (action === "send-otp") {
      if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
      await OTP.deleteMany({ email });
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
      await OTP.create({ email, otp: otpCode, expiresAt });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: `"Shiven Jobs" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Verification Code - Shiven Jobs",
        html: `<div style="font-family:sans-serif; padding:20px; border:1px solid #eee; border-radius:12px; max-width:500px;">
                <h2 style="color: #4F46E5;">Email Verification</h2>
                <p>Hello, Your OTP code is: <b>${otpCode}</b></p>
              </div>`
      });
      return NextResponse.json({ message: "OTP sent successfully!" });
    }

    if (action === "verify-otp") {
      const otp = data.otp; 
      const record = await OTP.findOne({ email }).sort({ createdAt: -1 });
      if (!record || record.otp !== otp) return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
      return NextResponse.json({ message: "Verified successfully!" });
    }

    if (action === "register") {
      const fullName = data.get("fullName");
      const password = data.get("password");
      const username = data.get("username");
      const existing = await ServiceProvider.findOne({ $or: [{ email }, { username }] });
      if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

      const hashedPassword = await bcrypt.hash(password, 10);
      const saveFile = async (file, prefix) => {
        if (!file || typeof file === "string") return null;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${prefix}_${Date.now()}_${file.name.replaceAll(" ", "_")}`;
        const uploadDir = path.join(process.cwd(), "public/uploads/sp_docs");
        try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        return `/uploads/sp_docs/${fileName}`;
      };

      const aadharPath = await saveFile(data.get("aadharFile"), "aadhar");
      const panPath = await saveFile(data.get("panFile"), "pan");
      const gstPath = await saveFile(data.get("gstFile"), "gst");

      await ServiceProvider.create({
        fullName, username, email,
        mobile: data.get("mobile"),
        whatsappNumber: data.get("whatsappNumber"), // નવું ફિલ્ડ ઉમેર્યું
        providerName: data.get("providerName"),
        serviceCategory: data.get("serviceCategory"),
        location: data.get("location"),
        gstNumber: data.get("gstNumber"),
        aadharNumber: data.get("aadharNumber"),
        panNumber: data.get("panNumber"),
        password: hashedPassword,
        aadharDoc: aadharPath || "No Document",
        panDoc: panPath || "No Document",
        gstDoc: gstPath || "No Document",
        isVerified: true,
        status: "pending",
        role: "serviceprovider",
      });

      await OTP.deleteMany({ email });
      return NextResponse.json({ success: true, message: "Registered! Waiting for approval." });
    }
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// src/app/api/serviceprovider/register/route.js માં PUT મેથડ
export async function PUT(req) {
  try {
    await connectMongo();
    const data = await req.json();
    
    const { 
      email, 
      fullName, 
      providerName, 
      serviceCategory, 
      experience, 
      location, 
      mobile, 
      whatsappNumber // ખાતરી કરો કે આ ડેટા આવે છે
    } = data;

    if (!email) return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });

    const updatedUser = await ServiceProvider.findOneAndUpdate(
      { email: email },
      { 
        $set: { 
          fullName, 
          providerName, 
          serviceCategory, 
          experience, 
          location, 
          mobile, 
          whatsappNumber // આ લાઈન ડેટાબેઝમાં ડેટા નાખશે
        } 
      },
      { new: true }
    );

    if (!updatedUser) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}