// src/models/Application.js
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    email: { type: String, required: true },          // user email from login
    pricing: { type: String, required: true },
    timeRequired: { type: String, required: true },
    additionalInfo: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
