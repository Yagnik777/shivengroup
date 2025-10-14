import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // your NextAuth config
import connectMongo from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import fs from "fs";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "User not logged in" }), { status: 401 });
    }

    await connectMongo();

    const formData = await req.formData();
    const userEmail = session.user.email;

    // Resume upload
    let resumeUrl = "";
    const resumeFile = formData.get("resume");
    if (resumeFile && resumeFile instanceof File) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      const filePath = `/uploads/${Date.now()}-${resumeFile.name}`;
      fs.writeFileSync(`./public${filePath}`, buffer);
      resumeUrl = filePath;
    }

    // Check if candidate already exists
    let candidate = await Candidate.findOne({ email: userEmail });

    if (candidate) {
      // Update existing
      candidate = await Candidate.findOneAndUpdate(
        { email: userEmail },
        {
          fullName: formData.get("fullName"),
          mobile: formData.get("mobile"),
          dob: formData.get("dob"),
          profession: formData.get("profession"),
          position: formData.get("position"),
          role: formData.get("role"),
          experience: formData.get("experience"),
          city: formData.get("city"),
          reference: formData.get("reference"),
          skills: JSON.parse(formData.get("skills") || "[]"),
          linkedin: formData.get("linkedin"),
          portfolio: formData.get("portfolio"),
          ...(resumeUrl && { resume: resumeUrl }),
        },
        { new: true }
      );
    } else {
      // Create new
      candidate = await Candidate.create({
        email: userEmail,
        fullName: formData.get("fullName"),
        mobile: formData.get("mobile"),
        dob: formData.get("dob"),
        profession: formData.get("profession"),
        position: formData.get("position"),
        role: formData.get("role"),
        experience: formData.get("experience"),
        city: formData.get("city"),
        reference: formData.get("reference"),
        skills: JSON.parse(formData.get("skills") || "[]"),
        linkedin: formData.get("linkedin"),
        portfolio: formData.get("portfolio"),
        resume: resumeUrl,
      });
    }

    return new Response(JSON.stringify(candidate), { status: 201 });
  } catch (error) {
    console.error("Error saving candidate:", error);
    return new Response(JSON.stringify({ message: "Server Error" }), { status: 500 });
  }
}

// GET all candidates (optional, admin use)
export async function GET() {
  try {
    await connectMongo();
    const candidates = await Candidate.find();
    return new Response(JSON.stringify(candidates), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Server Error" }), { status: 500 });
  }
}
