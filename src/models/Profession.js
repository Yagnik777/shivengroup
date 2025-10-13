import mongoose from "mongoose";

const ProfessionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Profession || mongoose.model("Profession", ProfessionSchema);
