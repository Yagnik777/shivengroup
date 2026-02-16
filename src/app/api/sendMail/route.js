// frontend/src/app/api/sendMail/route.js
import nodemailer from "nodemailer";
import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";
import Candidate from "@/models/Candidate";
import User from "@/models/User";
import ExcelCandidate from "@/models/ExcelCandidate";
import EmailQueue from "@/models/EmailQueue";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongo();

    const {
      subject,
      message,
      userIds,
      allUsers,
      type,
      emails = []
    } = await req.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Missing subject or message" },
        { status: 400 }
      );
    }

    let users = [];

    // ---------------------------------
    // FETCH USERS BASED ON TYPE
    // ---------------------------------
    if (type === "excel-candidates") {
      if (allUsers)
        users = await ExcelCandidate.find({}, "email unsubscribed mailCount");
      else if (userIds?.length)
        users = await ExcelCandidate.find(
          { _id: { $in: userIds } },
          "email unsubscribed mailCount"
        );
    }

    else if (type === "candidates") {
      if (allUsers)
        users = await Candidate.find({}, "email unsubscribed mailCount");
      else if (userIds?.length)
        users = await Candidate.find(
          { _id: { $in: userIds } },
          "email unsubscribed mailCount"
        );
    }

    else {
      if (allUsers)
        users = await Application.find({}, "email");
      else if (userIds?.length)
        users = await Application.find({ _id: { $in: userIds } }, "email");
    }

    const dbEmails = users.map(u => u.email).filter(Boolean);
    const allEmails = Array.from(new Set([...dbEmails, ...emails]));

    if (allEmails.length === 0)
      return NextResponse.json({ error: "No valid email addresses found" });

    // ---------------------------------
    // REMOVE UNSUBSCRIBED USERS
    // ---------------------------------
    let finalEmails = allEmails;

    if (type === "candidates" || type === "excel-candidates") {
      const unsubscribedEmails = users
        .filter(u => u.unsubscribed === true)
        .map(u => u.email);

      finalEmails = finalEmails.filter(
        (email) => !unsubscribedEmails.includes(email)
      );
    }

    if (finalEmails.length === 0) {
      return NextResponse.json({
        error: "All selected users are unsubscribed"
      });
    }

    // ---------------------------------
    // SEND EMAIL
    // ---------------------------------
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ShivEn Group Admin" <${process.env.EMAIL_USER}>`,
      to: finalEmails.join(","),
      subject,
      html: `
        <div style="font-family:sans-serif">
          <p>${message.replace(/\n/g, "<br/>")}</p>
          <hr/>
          <p style="font-size:12px;color:#777">
            This email was sent from ShivEn Group Admin.
          </p>
        </div>
      `,
    });

    // ---------------------------------
    // UPDATE MAIL COUNT
    // ---------------------------------
    if (type === "excel-candidates") {
      await ExcelCandidate.updateMany(
        { email: { $in: finalEmails } },
        { $inc: { mailCount: 1 } }
      );
    }

    if (type === "candidates") {
      await Candidate.updateMany(
        { email: { $in: finalEmails } },
        { $inc: { mailCount: 1 } }
      );
    }

    // ---------------------------------
    // REMOVE FROM EXCEL + EMAIL QUEUE IF REGISTERED USER
    // ---------------------------------
    const registeredApplications = await Application.find(
      { email: { $in: finalEmails } },
      "email"
    );

    const registeredUsers = await User.find(
      { email: { $in: finalEmails } },
      "email"
    );

    const registeredEmails = [
      ...registeredApplications.map(u => u.email),
      ...registeredUsers.map(u => u.email)
    ];

    if (registeredEmails.length > 0) {
      // REMOVE FROM ExcelCandidate (ONLY UNREGISTERED LIST)
      await ExcelCandidate.deleteMany({ email: { $in: registeredEmails } });

      // REMOVE FROM EmailQueue
      await EmailQueue.deleteMany({ email: { $in: registeredEmails } });

      
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
      sentTo: finalEmails.length,
    });

  } catch (err) {
    console.error("Send mail error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send mail" },
      { status: 500 }
    );
  }
}
