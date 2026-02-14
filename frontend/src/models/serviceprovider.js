import mongoose from "mongoose";

const ServiceProviderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    providerName: { type: String, required: true }, // Agency or Individual Name
    serviceCategory: { type: String, required: true }, // e.g., Resume Writing, Coaching
    experience: { type: String },
    location: { type: String },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    role: { type: String, default: "service_provider" },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceProvider || mongoose.model("ServiceProvider", ServiceProviderSchema);