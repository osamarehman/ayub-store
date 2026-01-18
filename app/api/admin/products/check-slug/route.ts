import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, excludeProductId } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Check if slug already exists (excluding current product if editing)
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    const isAvailable = !existingProduct || existingProduct.id === excludeProductId;

    return NextResponse.json({
      available: isAvailable,
      slug,
    });
  } catch (error: any) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check slug" },
      { status: 500 }
    );
  }
}
