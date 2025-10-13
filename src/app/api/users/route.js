import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Save uploaded file
const saveFile = async (file) => {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);
  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

  return `/uploads/${file.name}`;
};

export async function PUT(req) {
  try {
    await connectMongo();

    const formData = await req.formData(); // App Router compatible
    const email = formData.get("email");
    if (!email) return new Response("Email is required", { status: 400 });

    const fields = {};
    const resumeFile = formData.get("resume");

    
    if (resumeFile?.size > 0) fields.resume = await saveFile(resumeFile);

    // Other form fields
    for (const [key, value] of formData.entries()) {
      if (key !== "avatar" && key !== "resume") {
        fields[key] = value;
      }
    }

    if (fields.skills) fields.skills = JSON.parse(fields.skills);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: fields },
      { new: true, upsert: true }
    );

    updatedUser._id = updatedUser._id.toString();

    return new Response(
      JSON.stringify({ success: true, data: updatedUser }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
