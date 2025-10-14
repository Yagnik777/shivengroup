import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  resumeUrl: { type: String },
  coverLetter: { type: String },
  status: { type: String, enum: ["Pending","Reviewed","Rejected","Hired"], default: "Pending" },
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
export default Application;
