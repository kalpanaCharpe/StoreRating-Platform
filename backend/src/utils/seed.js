import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../config/db.js";

async function seed() {
  console.log("Seeding database...");

  const adminExists = await db.user.findUnique({
    where: { email: "admin@storerating.dev" },
  });

  if (!adminExists) {
    const hashed = await bcrypt.hash("Admin@1234", 12);
    await db.user.create({
      data: {
        name: "System Administrator Account",
        email: "admin@storerating.dev",
        password: hashed,
        role: "ADMIN",
        address: "123 Admin Street, System City",
      },
    });
    console.log("Admin created: admin@storerating.dev / Admin@1234");
  } else {
    console.log("Admin already exists, skipping.");
  }

  await db.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
