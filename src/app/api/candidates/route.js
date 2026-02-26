import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongo from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    await connectMongo();

    // Admin gets all candidates
    if (session.user.role === "admin") {
      const candidates = await Candidate.find({})
        .sort({ createdAt: -1 })
        .lean();
      return new Response(JSON.stringify(candidates), { status: 200 });
    }

    // Normal user gets own profile
    const candidate = await Candidate.findOne({
      userId: session.user.id,
    }).lean();

    return new Response(JSON.stringify(candidate), { status: 200 });

  } catch (error) {
    console.error("❌ GET Error:", error);
    return new Response(JSON.stringify({ message: "Server Error" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ message: "User not logged in" }), { status: 401 });
    }

    await connectMongo();
    const formData = await req.formData();

    // ===========================
    // FILE UPLOAD HANDLING
    // ===========================
    const fileFields = ["resume", "coverLetter", "experienceLetter"];
    const uploadedFiles = {};

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

    // ===========================
    // MAIN DATA MAPPING
    // ===========================
    const updateData = {
      userId: session.user.id,

      // Basic Info
      fullName: formData.get("fullName"),
      email: formData.get("email")?.trim() || session.user.email,
      mobile: formData.get("mobile"),
      dob: formData.get("dob"),
      gender: formData.get("gender"),
      profession: formData.get("profession"),
      position: formData.get("position"),
      Reference: formData.get("Reference"),

      // Address
      pincode: formData.get("pincode")?.trim() || "",
      state: formData.get("state"),
      city: formData.get("city"),
      address: formData.get("address"),
      reference: formData.get("reference"),

      // Links
      github: formData.get("github"),
      portfolio: formData.get("portfolio"),

      // Work Experience
      currentCompanyName: formData.get("currentCompanyName"),
      jobDepartment: formData.get("jobDepartment"),
      jobIndustry: formData.get("jobIndustry"),
      jobFromDate: formData.get("jobFromDate"),
      jobToDate: formData.get("jobToDate"),
      jobDescription: formData.get("jobDescription"),
      presentEmploymentStatus: formData.get("presentEmploymentStatus"),
      lastSalary: formData.get("lastSalary"),
      expectedSalary: formData.get("expectedSalary"),
      noticePeriod: formData.get("noticePeriod"),

      // Formal Education
      classXYear: formData.get("classXYear"),
      classXBoard: formData.get("classXBoard"),
      classXSchool: formData.get("classXSchool"),
      classXPercentage: formData.get("classXPercentage"),

      classXIIYear: formData.get("classXIIYear"),
      classXIIBoard: formData.get("classXIIBoard"),
      classXIISchool: formData.get("classXIISchool"),
      classXIIPercentage: formData.get("classXIIPercentage"),

      graduationYear: formData.get("graduationYear"),
      graduationUniversity: formData.get("graduationUniversity"),
      graduationInstitute: formData.get("graduationInstitute"),
      graduationSpecialization: formData.get("graduationSpecialization"),
      graduationPercentage: formData.get("graduationPercentage"),

      postGraduationYear: formData.get("postGraduationYear"),
      postGraduationUniversity: formData.get("postGraduationUniversity"),
      postGraduationInstitute: formData.get("postGraduationInstitute"),
      postGraduationSpecialization: formData.get("postGraduationSpecialization"),
      postGraduationPercentage: formData.get("postGraduationPercentage"),

      // Non Formal
      itiYear: formData.get("itiYear"),
      itiUniversity: formData.get("itiUniversity"),
      itiInstitute: formData.get("itiInstitute"),
      itiSpecialization: formData.get("itiSpecialization"),
      itiPercentage: formData.get("itiPercentage"),

      diplomaYear: formData.get("diplomaYear"),
      diplomaUniversity: formData.get("diplomaUniversity"),
      diplomaInstitute: formData.get("diplomaInstitute"),
      diplomaSpecialization: formData.get("diplomaSpecialization"),
      diplomaPercentage: formData.get("diplomaPercentage"),

      pgDiplomaYear: formData.get("pgDiplomaYear"),
      pgDiplomaUniversity: formData.get("pgDiplomaUniversity"),
      pgDiplomaInstitute: formData.get("pgDiplomaInstitute"),
      pgDiplomaSpecialization: formData.get("pgDiplomaSpecialization"),
      pgDiplomaPercentage: formData.get("pgDiplomaPercentage"),

      internshipDetails: formData.get("internshipDetails"),
      projectsDetails: formData.get("projectsDetails"),
      apprenticeDetails: formData.get("apprenticeDetails"),

      ...uploadedFiles,
    };

    // ===========================
    // Skills Parsing
    // ===========================
    try {
      const skillsRaw = formData.get("skills");
      updateData.skills = skillsRaw ? JSON.parse(skillsRaw) : [];
    } catch {
      updateData.skills = [];
    }

    // ===========================
    // Awards Parsing
    // ===========================
    try {
      const awardsRaw = formData.get("awards");
      updateData.awards = awardsRaw ? JSON.parse(awardsRaw) : [];
    } catch {
      updateData.awards = [];
    }

    const candidate = await Candidate.findOneAndUpdate(
      { userId: session.user.id },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    return new Response(JSON.stringify(candidate), { status: 201 });

  } catch (error) {
    console.error("❌ POST Error:", error);
    return new Response(
      JSON.stringify({ message: "Server Error", error: error.message }),
      { status: 500 }
    );
  }
}