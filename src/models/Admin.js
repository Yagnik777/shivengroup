// shivengroup-frontend/models/Admin.js
import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Avoid model recompilation in dev (Next.js hot reload)
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
export default Admin;
