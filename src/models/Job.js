// models/Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: "" },
  location: { type: String, default: "Remote" },

  jobCategory: { type: String, required: true }, // dynamic, no enum
  experienceLevel: { type: String, required: true }, // dynamic, no enum
  type: { type: String, required: true }, // dynamic, no enum

  description: { type: String, default: "" },
  requirements: { type: String, default: "" },
  published: { type: Boolean, default: false },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  date: { 
    type: Date, 
    default: Date.now 
  },
});

// Update 'updatedAt' on every save
JobSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
