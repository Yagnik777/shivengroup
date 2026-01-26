// scripts/updateAdminPassword.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

// Load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Import after env
const { default: connectMongo } = await import("../src/lib/mongodb.js");
const { default: Admin } = await import("../src/models/Admin.js");

async function updateAdminPassword() {
  try {
    await connectMongo();

    const email = "admin@gmail.com";       // 🔥 Jena password update karvo che
    const newPassword = "Hariom$$1356";      // 🔥 Navo password ahi lakho

    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log("❌ Admin not found!");
      process.exit(1);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    admin.password = hashed;
    await admin.save();

    console.log("✅ Admin password updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating password:", err.message);
    process.exit(1);
  }
}

updateAdminPassword();
