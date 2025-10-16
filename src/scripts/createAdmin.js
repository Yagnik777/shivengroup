import connectMongo from "../lib/mongodb.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

const run = async () => {
  await connectMongo();

  const email = "admin@gmail.com";
  const password = "admin@123";

  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const admin = new Admin({ email, password: hash, name: "Admin" });
  await admin.save();

  console.log("Admin created", admin.email);
  process.exit(0);
};

run();
