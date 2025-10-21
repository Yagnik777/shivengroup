// models/Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: "" },
  location: { type: String, default: "Remote" },

  jobCategory: {
    type: String,
    enum: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "WordPress Developer",
      "MERN Developer",
      "Content Writer",
      "Content Marketer",
      "SEO Specialist",
      "UI/UX Designer",
      "QA Tester",
    ],
    required: true,
  },

  experienceLevel: {
    type: String,
    enum: ["Entry", "Mid", "Senior"],
    default: "Entry",
  },

  type: {
    type: String,
    enum: ["full-time", "part-time", "contract", "freelance"],
    default: "full-time",
  },

  description: { type: String, default: "" },
  requirements: { type: String, default: "" },
  published: { type: Boolean, default: false },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

// Update 'updatedAt' on every save
JobSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
