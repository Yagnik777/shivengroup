// src/models/Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: "Full-time" }, // e.g., Full-time, Part-time, Freelance, Contract
  experienceLevel: { type: String, default: "Entry" }, // Entry, Mid, Senior
  location: { type: String, default: "Remote" },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
export default Job;
