import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,
    linkedIn: String,
    portfolio: String,
    price: Number,
    estimatedDays: Number,
    coverLetter: String,

    // ✅ FIXED: Properly structured attachments array
    attachments: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        data: { type: Buffer },
        type: { type: String }
      }
    ],

    jobCategory: String,
    jobType: String,
    experienceLevel: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminNote: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,   // <-- DEFAULT DATE-TIME
    },
  },
  { timestamps: true }
);

// ✅ FIX: Force schema reload to avoid Vercel/Mongoose model cache issues
if (mongoose.models.Application) {
  delete mongoose.connection.models["Application"];
}

export default mongoose.model("Application", applicationSchema);
