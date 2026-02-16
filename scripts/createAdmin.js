// scripts/createAdmin.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

// -----------------------------
// 🔹 Load Environment Variables
// -----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing. Please add it to your .env file.");
  process.exit(1);
}

// -----------------------------
// 🔹 Import Dependencies AFTER dotenv
// -----------------------------
const { default: connectMongo } = await import("../src/lib/mongodb.js");
const { default: Admin } = await import("../src/models/Admin.js");

// -----------------------------
// 🔹 Main Function
// -----------------------------
async function createOrUpdateAdmin() {
  try {
    await connectMongo();

    const adminData = {
      
      name: "Admin",             // 🔹 Change as needed
      email: "admin@gmail.com",  // 🔹 Change as needed
      password: "Hariom$$1356",     // 🔹 Change as needed
    };

    const existingAdmin = await Admin.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log(`⚠️ Admin already exists: ${existingAdmin.email}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    await Admin.create({
      ...adminData,
      password: hashedPassword,
    });

    console.log("✅ Admin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

// -----------------------------
// 🔹 Run
// -----------------------------
createOrUpdateAdmin();
