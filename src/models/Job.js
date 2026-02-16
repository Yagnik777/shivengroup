import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: String, // Or mongoose.Schema.Types.ObjectId if using real Auth
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // This links the job to your Company model
      required: true,
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    jobType: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    description: { type: String, required: true },
    skills: { type: [String], default: [] }, // Stored as Array
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["active", "closed", "draft"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);