// scripts/createAdmin.js (run with node)
import connectMongo from "../src/lib/mongodb.js";
import Admin from "../src/models/Admin.js";
import bcrypt from "bcryptjs";

async function run() {
  await connectMongo();

  const email = "admin@gmail.com";
  const password = "admin@123";
  const name = "admin";

  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const admin = new Admin({ name, email, password: hash });
  await admin.save();
  console.log("Admin created");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
