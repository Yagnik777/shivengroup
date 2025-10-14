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
    experience: String,
    city: String,
    reference: String,
    skills: [String],
    linkedin: String,
    portfolio: String,
    resume: String,
  },
  { timestamps: true }
);

export default mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);
