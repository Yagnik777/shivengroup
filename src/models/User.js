// /src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "candidate" },
    acceptedTerms: { type: Boolean, default: false },

    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    date: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
