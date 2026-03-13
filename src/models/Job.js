import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: String, 
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", 
      required: true,
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    industry: { type: String, required: true }, // નવું ફિલ્ડ
    profession: { type: String, required: true }, // નવું ફિલ્ડ
    designation: { type: String, required: true }, // નવું ફિલ્ડ
    department: { type: String, required: true }, // નવું ફિલ્ડ
    jobType: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String }, // ટેક્સ્ટ એરિયા માટે
    skills: { type: [String], default: [] }, 
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["active", "closed", "draft"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);