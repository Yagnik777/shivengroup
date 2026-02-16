import mongoose from "mongoose";

const ServiceFormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    providerName: { type: String, required: true },
    providerMobile: { type: String, required: true },
    providerEmail: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceForm || mongoose.model("ServiceForm", ServiceFormSchema);