// src/models/Application.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  fullName: String,
  email: String,
  phone: String,
  resumeUrl: String,
  coverLetter: String,
  createdAt: { type: Date, default: Date.now },
});

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
export default Application;
