import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// ✅ GET: લોગિન થયેલા યુઝરની પ્રોફાઇલ મેળવવા માટે
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    await connectMongo();

    // URL માંથી ઈમેલ પેરામીટર લેવા (જો હોય તો)
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get("email");

    // જો ઈમેલ હોય તો એનાથી શોધો, નહીતર લોગિન યુઝરના ID થી શોધો
    let query = { userId: session.user.id };
    if (emailParam) {
      query = { email: emailParam };
    }

    const candidate = await Candidate.findOne(query).lean();

    if (!candidate) {
      return new Response(JSON.stringify(null), { status: 200 }); // ડેટા ન મળે તો null મોકલો
    }

    return new Response(JSON.stringify(candidate), { status: 200 });
  } catch (error) {
    console.error("❌ GET Error:", error);
    return new Response(JSON.stringify({ message: "Server Error" }), { status: 500 });
  }
}

// ✅ POST: CREATE or UPDATE candidate profile
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ message: "User not logged in" }), { status: 401 });
    }

    await connectMongo();
    const formData = await req.formData();

    // ✅ File Upload Handling
    const fileFields = ["resume", "coverLetter", "experienceLetter"];
    const uploadedFiles = {};

    // Uploads ફોલ્ડર છે કે નહીં તે ચેક કરો
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const field of fileFields) {
      const file = formData.get(field);
      if (file && file instanceof File && file.name !== "undefined") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name.replaceAll(" ", "_")}`;
        const filePath = `/uploads/${fileName}`;
        fs.writeFileSync(path.join(process.cwd(), `public${filePath}`), buffer);
        uploadedFiles[field] = filePath;
      }
    }

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
      linkedin: formData.get("linkedin"),
      portfolio: formData.get("portfolio"),
      ...uploadedFiles,
    };

    // Skills handling
    try {
      const skillsRaw = formData.get("skills");
      updateData.skills = skillsRaw ? JSON.parse(skillsRaw) : [];
    } catch (e) {
      updateData.skills = [];
    }

    // ✅ UPSERT Logic (જો હોય તો Update, નહીતર Create)
    const candidate = await Candidate.findOneAndUpdate(
      { userId: session.user.id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    return new Response(JSON.stringify(candidate), { status: 201 });
  } catch (error) {
    console.error("❌ Error saving candidate:", error);
    return new Response(JSON.stringify({ message: "Server Error", error: error.message }), { status: 500 });
  }
}