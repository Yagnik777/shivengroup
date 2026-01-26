import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import fs from "fs";

export const dynamic = "force-dynamic";

// ✅ CREATE or UPDATE candidate profile
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.user?.id) {
      return new Response(JSON.stringify({ message: "User not logged in" }), { status: 401 });
    }

    await connectMongo();

    const formData = await req.formData();
    const userEmail = session.user.email;

    // ✅ Handle multiple optional files
    const fileFields = ["resume", "coverLetter", "experienceLetter"];
    const uploadedFiles = {};

    for (const field of fileFields) {
      const file = formData.get(field);
      if (file && file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = `/uploads/${Date.now()}-${file.name}`;
        fs.writeFileSync(`./public${filePath}`, buffer);
        uploadedFiles[field] = filePath; // store path for DB
      }
    }

    // ✅ Check if candidate already exists
    let candidate = await Candidate.findOne({ userId: session.user.id });

    const updateData = {
      fullName: formData.get("fullName"),
      email: formData.get("email")?.trim() || session.user.email,
      mobile: formData.get("mobile"),
      dob: formData.get("dob"),
      profession: formData.get("profession"),
      position: formData.get("position"),
      role: formData.get("role"),
      experience: formData.get("experience"),
      city: formData.get("city"),
      reference: formData.get("reference"),
      pincode: formData.get("pincode")?.trim() || "",
      state: formData.get("state"),
      education: formData.get("education"),
      skills: JSON.parse(formData.get("skills") || "[]"),
      linkedin: formData.get("linkedin"),
      portfolio: formData.get("portfolio"),
      ...uploadedFiles, // ✅ spread all 3 files
    };

    if (candidate) {
      candidate = await Candidate.findOneAndUpdate(
        { userId: session.user.id },
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      candidate = await Candidate.create({
        userId: session.user.id,
        
        ...updateData,
      });
    }

    return new Response(JSON.stringify(candidate), { status: 201 });
  } catch (error) {
    console.error("❌ Error saving candidate:", error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
}

// ✅ GET all candidates
export async function GET() {
  try {
    await connectMongo();
    const candidates = await Candidate.find().lean();
    return new Response(JSON.stringify(candidates), { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
