// src/models/Application.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String },
    email: { type: String, required: true },          // user email from login
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    pricing: { type: String, required: true },
    timeRequired: { type: String, required: true },
    additionalInfo: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Reviewed", "Accepted", "Rejected"], default: "Pending" },
    
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
