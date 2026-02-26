export const dynamic = "force-dynamic";

import connectMongo from "@/lib/mongodb";
import Recruiter from "@/models/Recruiter";
import OTP from "@/models/EmailOTP";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

// --- GET Method ---
export async function GET(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "get-profile") {
      const data = await Recruiter.findOne().sort({ createdAt: -1 });
      return Response.json({ data: data || null });
    }
    return Response.json({ error: "Invalid GET action" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectMongo();

    let body = {};
    let files = {};
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
      
      files.gstDocument = formData.get("gstDocument");
      files.businessLicense = formData.get("businessLicense");
      files.aadharDocument = formData.get("aadharDocument"); 
      files.panDocument = formData.get("panDocument");       
    } else {
      body = await req.json();
    }

    const { 
      action, email, otp, password, fullName, username, 
      mobile, companyName, designation, location, gstNumber,
      aadharNumber, panNumber, registrationType 
    } = body;

    // --- Action: Update Profile (FIXED) ---
    if (action === "update-profile") {
      // બોડી માંથી ઈમેલ કાઢવો જરૂરી છે ફિલ્ટર માટે
      const filterEmail = body.email || email;

      if (!filterEmail) {
        return Response.json({ error: "Email is required to update profile" }, { status: 400 });
      }

      // 'action' ને અપડેટ ડેટા માંથી કાઢી નાખવો
      const { action: _, ...updateData } = body; 

      const updated = await Recruiter.findOneAndUpdate(
        { email: filterEmail.toLowerCase().trim() }, // ઈમેલ થી યુઝર શોધો
        { $set: updateData },
        { new: true } 
      );

      if (!updated) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      return Response.json({ message: "Profile updated successfully!", data: updated });
    }

    // --- Action: Send OTP ---
    if (action === "send-otp") {
      if (!email) return Response.json({ error: "Email required" }, { status: 400 });
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await OTP.deleteMany({ email });
      await OTP.create({ email, otp: otpCode, expiresAt });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Shiven Jobs" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Recruiter Verification Code",
        html: `<div style="font-family: sans-serif; padding: 20px;">
                <h2>Recruiter Verification</h2>
                <h1 style="color: #4F46E5;">${otpCode}</h1>
                <p>OTP valid for 5 minutes.</p>
              </div>`
      });
      return Response.json({ message: "OTP sent!" });
    }

    // --- Action: Verify OTP ---
    if (action === "verify-otp") {
      if (!email || !otp) return Response.json({ error: "Email & OTP required" }, { status: 400 });
      const record = await OTP.findOne({ email }).sort({ createdAt: -1 });
      if (!record || record.otp !== otp) return Response.json({ error: "Invalid OTP" }, { status: 400 });
      if (record.expiresAt < new Date()) return Response.json({ error: "OTP expired" }, { status: 400 });
      return Response.json({ message: "OTP verified successfully!" });
    }

    // --- Action: Register ---
    if (action === "register") {
      const existing = await Recruiter.findOne({ $or: [{ email }, { username }] });
      if (existing) return Response.json({ error: "Email or Username already exists" }, { status: 400 });

      let gstPath = "", licensePath = "", aadharPath = "", panPath = "";
      const saveFile = async (file, prefix) => {
        if (!file || typeof file === "string") return null;
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), "public/uploads/recruiters");
        try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }
        const fileName = `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        await fs.writeFile(path.join(uploadDir, fileName), buffer);
        return `/uploads/recruiters/${fileName}`;
      };

      if (files.gstDocument) gstPath = await saveFile(files.gstDocument, "gst");
      if (files.businessLicense) licensePath = await saveFile(files.businessLicense, "license");
      if (files.aadharDocument) aadharPath = await saveFile(files.aadharDocument, "aadhar");
      if (files.panDocument) panPath = await saveFile(files.panDocument, "pan");

      const hashed = await bcrypt.hash(password, 10);

      const newRecruiter = await Recruiter.create({
        fullName, username, email, mobile, companyName, designation, location,
        password: hashed,
        registrationType,
        gstNumber: gstNumber || null,
        aadharNumber: aadharNumber || null,
        panNumber: panNumber || null,
        gstProof: gstPath || null,
        businessLicense: licensePath || null,
        aadharProof: aadharPath || null,
        panProof: panPath || null,
        isEmailVerified: true,
        isApproved: false,
        status: "pending",
        role: "recruiter"
      });

      await OTP.deleteMany({ email });
      return Response.json({ message: "Registered successfully!", data: newRecruiter });
    }
    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}