// import connectMongo from "@/lib/mongodb";
// import Application from "@/models/Application";
// import Job from "@/models/Job";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";

// export const dynamic = "force-dynamic";
// //export const config = { api: { bodyParser: false } };

// // ---------------- POST - Submit new application ----------------
// export async function POST(req) {
//   try {
//     await connectMongo();
    


//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ message: "Login required" }, { status: 401 });
//     }

//     const formData = await req.formData();

//     const jobId = formData.get("jobId");
//     const resumeFile = formData.get("resume");
//     const price = Number(formData.get("pricing"));
//     const estimatedDays = Number(formData.get("timeRequired"));
//     const coverLetter = formData.get("additionalInfo");
//     const phone = formData.get("phone") || "";
//     const linkedIn = formData.get("linkedIn") || "";
//     const portfolio = formData.get("portfolio") || "";

//     if (!jobId || !resumeFile || isNaN(price) || isNaN(estimatedDays) || !coverLetter) {
//       return NextResponse.json({ message: "Missing required fields or resume" }, { status: 400 });
//     }

//     const job = await Job.findById(jobId);
//     if (!job) return NextResponse.json({ message: "Job not found" }, { status: 404 });

//     const exists = await Application.findOne({ job: jobId, candidate: session.user.id });
//     if (exists) return NextResponse.json({ message: "Already applied" }, { status: 400 });

//     // Save resume directly to /public folder
//     const publicDir = path.join(process.cwd(), "public");
//     if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

//     const fileName = `${Date.now()}-${resumeFile.name}`;
//     const filePath = path.join(publicDir, fileName);
//     const buffer = Buffer.from(await resumeFile.arrayBuffer());
//     fs.writeFileSync(filePath, buffer);

//     const attachment = {
//       name: resumeFile.name,
//       url: `/${fileName}`, // ✅ Saved directly in /public
//       type: resumeFile.type,
//     };

//     const app = await Application.create({
//       job: job._id,
//       candidate: session.user.id,
//       name: session.user.name,
//       email: session.user.email,
//       phone,
//       linkedIn,
//       portfolio,
//       price,
//       estimatedDays,
//       coverLetter,
//       attachments: [attachment],
//       jobCategory: job.jobCategory,
//       jobType: job.type,
//       experienceLevel: job.experienceLevel,
//       status: "pending",
//     });

//     return NextResponse.json({ message: "Application submitted", application: app }, { status: 201 });
//   } catch (err) {
//     console.error("Error saving application:", err);
//     return NextResponse.json({ message: "Failed to submit application", error: err.message }, { status: 500 });
//   }
// }

// // ---------------- GET - Fetch all applications ----------------
// export async function GET() {
//   try {
//     await connectMongo();
//     const applications = await Application.find()
//       .populate("job", "title jobCategory type experienceLevel")
//       .sort({ createdAt: -1 });

//     return NextResponse.json(applications || [], { status: 200 });
//   } catch (err) {
//     console.error("Error fetching applications:", err);
//     return NextResponse.json({ message: "Failed to fetch applications", error: err.message }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";
import Candidate from "@/models/Candidate";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 1. POST: યુઝર જ્યારે એપ્લાય કરે (Candidate પ્રોફાઇલમાંથી ડેટા ખેંચીને)
export async function POST(req) {
  try {
    await connectMongo();
    
    // સેસન ચેક કરો
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const body = await req.json();
    const { jobId, recruiterId, role } = body;

    // Candidate મોડલમાંથી લોગિન યુઝરનો ફૂલ ડેટા શોધો
    const userProfile = await Candidate.findOne({ userId: session.user.id });

    if (!userProfile) {
      return NextResponse.json({ 
        error: "તમારી પ્રોફાઇલ અધૂરી છે. પહેલા Profile પેજ પર જઈને વિગતો ભરો!" 
      }, { status: 400 });
    }

    // Application સેવ કરો
    const newApp = await Application.create({
      jobId,
      recruiterId,
      name: userProfile.fullName, 
      email: userProfile.email,   
      role: role,                 
      resumeUrl: userProfile.resume, 
      mobile: userProfile.mobile,   
      city: userProfile.city,       
      profession: userProfile.profession, // વધારાની વિગત
      experience: userProfile.experience, // વધારાની વિગત
      status: "Pending", // બાય ડિફોલ્ટ પેન્ડિંગ
      appliedAt: new Date()
    });

    return NextResponse.json({ ok: true, data: newApp });
  } catch (err) {
    console.error("Apply Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. GET: રિક્રુટર માટે બધા જ કેન્ડિડેટ્સનું લિસ્ટ મેળવવા
export async function GET() {
  try {
    await connectMongo();
    // બધા જ કેન્ડિડેટ્સ લેટેસ્ટ તારીખ મુજબ મેળવો
    const apps = await Application.find().sort({ appliedAt: -1 });
    return NextResponse.json({ ok: true, data: apps });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. PATCH: રિક્રુટર જ્યારે Approve કે Reject બટન દબાવે
export async function PATCH(req) {
  try {
    await connectMongo();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing ID or Status" }, { status: 400 });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id, 
      { status: status }, 
      { new: true }
    );

    return NextResponse.json({ ok: true, data: updatedApp });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}