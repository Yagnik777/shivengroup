import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: String,
    email: String,
    mobile: String,
    dob: String,
    profession: String,
    position: String,
    role: String,
    pincode: { 
      type: String, 
      match: [/^\d{6}$/, "Pincode must be exactly 6 digits"]
    },
    state: String,
    education: String,
    experience: String,
    city: String,
    reference: String,
    skills: [String],
    linkedin: String,
    portfolio: String,
    resume: String,
    coverLetter: String,       // ✅ Cover Letter file path
    experienceLetter: String,
    date: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);
