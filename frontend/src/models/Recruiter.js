//src/models/Recruiter.js
import mongoose from "mongoose";

const RecruiterSchema = new mongoose.Schema(
  {
    /* =============================
       🔐 ACCOUNT DETAILS
    ============================= */
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "recruiter",
    },

    /* =============================
       🏢 COMPANY DETAILS
    ============================= */
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    /* =============================
       📂 FILE UPLOADS (PATHS)
    ============================= */
    companyLogo: {
      type: String,
      default: null, // /uploads/logo.png
    },

    businessLicense: {
      type: String,
      default: null,
    },

    gstProof: {
      type: String,
      default: null,
    },

    /* =============================
       🔐 VERIFICATION & STATUS
    ============================= */
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false, // Admin approval
    },
  },
  {
    timestamps: true,
  }
);

/* =============================
   ✅ SAFE EXPORT (Next.js)
============================= */
export default mongoose.models.Recruiter ||
  mongoose.model("Recruiter", RecruiterSchema);