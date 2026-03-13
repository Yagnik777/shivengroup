import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb"; 
import Job from "@/models/Job"; // Recruiter મોડેલ
import CandidateJob from "@/models/CandidateJob"; // Candidate મોડેલ

export async function GET() {
  try {
    await connectMongo();

    // 1. બંને કલેક્શનમાંથી ડેટા મેળવો
    // Recruiter Jobs (જેનું મોડેલ 'Job' છે)
    const recruiterJobs = await Job.find({}).lean();
    
    // Candidate Jobs
    const candidateJobs = await CandidateJob.find({}).lean();

    // 2. દરેક ડેટામાં 'postedByRole' ફિલ્ડ ઉમેરો જેથી ઓળખી શકાય
    const formattedRecruiterJobs = recruiterJobs.map(job => ({
      ...job,
      postedByRole: "recruiter"
    }));

    const formattedCandidateJobs = candidateJobs.map(job => ({
      ...job,
      postedByRole: "candidate"
    }));

    // 3. બંને લિસ્ટને ભેગા કરો (Combine)
    const allJobs = [...formattedRecruiterJobs, ...formattedCandidateJobs];

    // 4. લેટેસ્ટ જોબ્સ પહેલા દેખાય તે માટે Sort કરો
    // જો તમારા Schema માં timestamps: true હશે તો આ પ્રોપર કામ કરશે
    allJobs.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;
      return dateB - dateA;
    });

    return NextResponse.json(allJobs, { status: 200 });
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}