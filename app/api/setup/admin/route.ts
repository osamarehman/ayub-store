import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@binayub.com" },
      update: {
        password: hashedPassword,
        role: "ADMIN",
      },
      create: {
        email: "admin@binayub.com",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created/updated successfully",
      admin: {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
      credentials: {
        email: "admin@binayub.com",
        password: "admin123",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
