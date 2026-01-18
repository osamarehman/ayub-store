"use server";

import { signIn, signOut } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { getUserByEmail } from "@/lib/auth/queries";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

/**
 * Authenticate user
 */
export async function authenticate(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

/**
 * Register new user
 */
export async function register(data: RegisterInput) {
  try {
    // Validate input
    const validatedFields = registerSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already in use" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    // Auto sign in after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong" };
  }
}

/**
 * Logout user
 */
export async function logout() {
  await signOut({ redirectTo: "/login" });
}
