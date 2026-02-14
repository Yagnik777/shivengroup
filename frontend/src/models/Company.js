import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    recruiterId: {
      type: String,
      required: true,
      unique: true, // One recruiter can manage only one company
    },
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      enum: [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees",
        "201-500 employees",
        "500+ employees",
      ],
      default: "11-50 employees",
    },
    founded: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // URL of the uploaded image
      default: "",
    },
    coverImage: {
      type: String, // URL of the uploaded image
      default: "",
    },
    specialties: {
      type: [String], // Stored as an array for easier filtering/searching
      default: [],
    },
  },
  { timestamps: true }
);

// This prevents Mongoose from creating the model multiple times during Hot Reload in Next.js
export default mongoose.models.Company || mongoose.model("Company", CompanySchema);