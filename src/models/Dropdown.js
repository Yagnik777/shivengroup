import mongoose from "mongoose";

const DropdownSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "profession",
        "position",
        "role",
        "experience",
        "city",
        "reference",
        "skills",
        "jobCategory",       // ✅ NEW
        "experienceLevel",   // ✅ NEW
        "jobType"            // ✅ NEW
      ],
      required: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Dropdown ||
  mongoose.model("Dropdown", DropdownSchema);
