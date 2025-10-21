import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  linkedIn: String,
  portfolio: String,
  price: Number,
  estimatedDays: Number,
  coverLetter: String,
  attachments: [
    {
      name: String,
      url: String,
      data: Buffer,
      type: String,
    }
  ],
  jobCategory: String,
  jobType: String,
  experienceLevel: String,
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
}, { timestamps: true });

export default mongoose.models.Application || mongoose.model("Application", applicationSchema);
