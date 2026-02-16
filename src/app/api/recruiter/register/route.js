// export const dynamic = "force-dynamic";

// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongodb";
// import EmailOTP from "@/models/EmailOTP";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
//   import Recuriterregister from "@/models/Recuriterregister";

// export async function POST(req) {
//   try {
//     await connectMongo();

//     const {
//       action,
//       fullName,
//       username,
//       email,
//       password,
//       mobile,
//       companyName,
//       designation,
//       location,
//       otp,
//       companyLogo,
//       businessLicense,
//       gstProof,
//     } = await req.json();

//     /* --------------------------------------------------------
//        1️⃣ ACTION → SEND OTP  (USER JEVU)
//     -------------------------------------------------------- */
//     if (action === "send-otp") {
//       if (!email) {
//         return NextResponse.json(
//           { error: "Email required" },
//           { status: 400 }
//         );
//       }

//       // remove old otp
//       await EmailOTP.deleteMany({ email });

//       const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
//       const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 min

//       await EmailOTP.create({
//         email,
//         otp: otpCode,
//         expiresAt,
//       });

//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASS,
//         },
//       });

//       await transporter.sendMail({
//         from: `"Your App" <${process.env.SMTP_USER}>`,
//         to: email,
//         subject: "Recruiter Email Verification Code",
//         html: `
//           <h2>Email Verification</h2>
//           <h1>${otpCode}</h1>
//           <p>OTP valid for <b>2 minutes</b>.</p>
//         `,
//       });

//       return NextResponse.json({ message: "OTP sent!" });
//     }

//     /* --------------------------------------------------------
//        2️⃣ ACTION → VERIFY OTP  (USER JEVU)
//     -------------------------------------------------------- */
//     if (action === "verify-otp") {
//       if (!email || !otp) {
//         return NextResponse.json(
//           { error: "Email & OTP required" },
//           { status: 400 }
//         );
//       }

//       const record = await EmailOTP.findOne({ email }).sort({
//         createdAt: -1,
//       });

//       if (!record) {
//         return NextResponse.json(
//           { error: "OTP not found" },
//           { status: 400 }
//         );
//       }

//       if (record.otp !== otp) {
//         return NextResponse.json(
//           { error: "Invalid OTP" },
//           { status: 400 }
//         );
//       }

//       if (record.expiresAt < new Date()) {
//         return NextResponse.json(
//           { error: "OTP expired" },
//           { status: 400 }
//         );
//       }

//       // mark verified
//       record.verified = true;
//       await record.save();

//       return NextResponse.json({ message: "OTP verified successfully!" });
//     }

//     /* --------------------------------------------------------
//        3️⃣ ACTION → REGISTER RECRUITER
//     -------------------------------------------------------- */
//     if (action === "register") {
//       if (
//         !fullName ||
//         !username ||
//         !email ||
//         !password ||
//         !mobile ||
//         !companyName ||
//         !designation ||
//         !location
//       ) {
//         return NextResponse.json(
//           { error: "All required fields are mandatory" },
//           { status: 400 }
//         );
//       }

//       // 🔐 check otp verified
//       const otpRecord = await EmailOTP.findOne({
//         email,
//         verified: true,
//       });

//       if (!otpRecord) {
//         return NextResponse.json(
//           { error: "Email not verified" },
//           { status: 403 }
//         );
//       }

//       // 🔍 check existing recruiter
//       const exists = await Recruiter.findOne({
//         $or: [{ email }, { username }],
//       });

//       if (exists) {
//         return NextResponse.json(
//           { error: "Recruiter already exists" },
//           { status: 409 }
//         );
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const recruiter = await Recruiter.create({
//         fullName,
//         username,
//         email,
//         password: hashedPassword,
//         mobile,
//         companyName,
//         designation,
//         location,

//         companyLogo: companyLogo || null,
//         businessLicense: businessLicense || null,
//         gstProof: gstProof || null,

//         isEmailVerified: true,
//         isApproved: false,
//         role: "recruiter",
//       });

//       // cleanup otp
//       await EmailOTP.deleteMany({ email });

//       return NextResponse.json(
//         {
//           message:
//             "Recruiter registered successfully. Await admin approval.",
//           recruiterId: recruiter._id,
//         },
//         { status: 201 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Invalid action" },
//       { status: 400 }
//     );
//   } catch (err) {
//     console.error("Recruiter Auth Error:", err);
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }
//src/app/api/recruiter/register/route.js
// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongodb";
// import Recruiter from "@/models/Recruiter";
// import EmailOTP from "@/models/EmailOTP";
// import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";

// export async function POST(req) {
//   try {
//     await connectMongo();
//     const body = await req.json();
//     const { action, email, otp, password, fullName, username, mobile, companyName, designation, location } = body;

//     // 1. SEND OTP
//     if (action === "send-otp") {
//       const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
//       await EmailOTP.deleteMany({ email });
//       await EmailOTP.create({ email, otp: otpCode, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
//       });

//       await transporter.sendMail({
//         from: `"JobConnect Pro" <${process.env.SMTP_USER}>`,
//         to: email,
//         subject: "Recruiter Verification Code",
//         html: `<div style="font-family:sans-serif;"><h2>Verification Code</h2><h1>${otpCode}</h1><p>Valid for 5 minutes.</p></div>`,
//       });
//       return NextResponse.json({ message: "OTP sent!" });
//     }

//     // 2. VERIFY OTP
//     if (action === "verify-otp") {
//       const record = await EmailOTP.findOne({ email, otp });
//       if (!record || record.expiresAt < new Date()) {
//         return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
//       }
//       record.verified = true;
//       await record.save();
//       return NextResponse.json({ message: "OTP verified!" });
//     }

//     // 3. REGISTER RECRUITER
//     if (action === "register") {
//       const otpRecord = await EmailOTP.findOne({ email, verified: true });
//       if (!otpRecord) return NextResponse.json({ error: "Verify email first" }, { status: 403 });

//       const exists = await Recruiter.findOne({ $or: [{ email }, { username }] });
//       if (exists) return NextResponse.json({ error: "Email or Username already exists" }, { status: 409 });

//       const hashedPassword = await bcrypt.hash(password, 10);
//       await Recruiter.create({
//         fullName, username, email, mobile, companyName, designation, location,
//         password: hashedPassword, isEmailVerified: true, role: "recruiter"
//       });

//       await EmailOTP.deleteMany({ email });
//       return NextResponse.json({ message: "Registered successfully!" }, { status: 201 });
//     }

//     return NextResponse.json({ error: "Invalid action" }, { status: 400 });
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
export const dynamic = "force-dynamic";

import connectMongo from "@/lib/mongodb";
import Recruiter from "@/models/Recruiter";
import OTP from "@/models/EmailOTP";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const { 
      action, email, otp, password, fullName, username, 
      mobile, companyName, designation, location 
    } = body;

    /* --------------------------------------------------------
        1️⃣ ACTION → SEND OTP
    -------------------------------------------------------- */
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
        from: `"JobConnect Pro" <${process.env.SMTP_USER}>`,
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

    /* --------------------------------------------------------
        2️⃣ ACTION → VERIFY OTP (No Recruiter check here)
    -------------------------------------------------------- */
    if (action === "verify-otp") {
      if (!email || !otp) return Response.json({ error: "Email & OTP required" }, { status: 400 });

      const record = await OTP.findOne({ email }).sort({ createdAt: -1 });

      if (!record || record.otp !== otp)
        return Response.json({ error: "Invalid OTP" }, { status: 400 });

      if (record.expiresAt < new Date())
        return Response.json({ error: "OTP expired" }, { status: 400 });

      // અહીં Recruiter શોધવાની જરૂર નથી, બસ કન્ફર્મ કરો કે OTP સાચો છે
      return Response.json({ message: "OTP verified successfully!" });
    }

    /* --------------------------------------------------------
        3️⃣ ACTION → REGISTER RECRUITER (Final Step)
    -------------------------------------------------------- */
    if (action === "register") {
      if (!fullName || !email || !password || !username || !companyName) {
        return Response.json({ error: "Required fields are missing" }, { status: 400 });
      }

      const existing = await Recruiter.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        return Response.json({ error: "Email or Username already exists" }, { status: 400 });
      }

      const hashed = await bcrypt.hash(password, 10);

      // અહીં જ રેકોર્ડ બનાવો અને isEmailVerified: true સેટ કરો
      await Recruiter.create({
        fullName,
        username,
        email,
        mobile,
        companyName,
        designation,
        location,
        password: hashed,
        isEmailVerified: true, // કારણ કે તે OTP વેરીફાય કરીને જ અહીં આવ્યો છે
        isApproved: false,
        role: "recruiter",
      });

      await OTP.deleteMany({ email });
      return Response.json({ message: "Registered successfully!" });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error: " + err.message }, { status: 500 });
  }
}