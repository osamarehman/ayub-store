import { prisma } from "../lib/db/prisma";
import bcrypt from "bcryptjs";

// Admin credentials - CHANGE THESE IN PRODUCTION
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@binayub.store";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "BinAyub@2024!";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

async function createAdmin() {
  console.log("=".repeat(50));
  console.log("Bin Ayub Store - Admin User Setup");
  console.log("=".repeat(50));
  console.log();

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

  try {
    const adminUser = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        role: "ADMIN",
        password: hashedPassword,
      },
      create: {
        email: ADMIN_EMAIL,
        name: ADMIN_NAME,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created/updated successfully!");
    console.log();
    console.log("Login Credentials:");
    console.log("-".repeat(30));
    console.log(`Email:    ${adminUser.email}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Role:     ${adminUser.role}`);
    console.log();
    console.log("IMPORTANT: Change the password after first login!");
    console.log();
  } catch (error: any) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
