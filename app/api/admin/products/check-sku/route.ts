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
    const { sku, excludeVariantId } = body;

    if (!sku) {
      return NextResponse.json({ error: "SKU is required" }, { status: 400 });
    }

    // Check if SKU already exists (excluding current variant if editing)
    const existingVariant = await prisma.productVariant.findUnique({
      where: { sku },
      select: { id: true },
    });

    const isAvailable = !existingVariant || existingVariant.id === excludeVariantId;

    return NextResponse.json({
      available: isAvailable,
      sku,
    });
  } catch (error: any) {
    console.error("Error checking SKU:", error);
    return NextResponse.json(
      { error: error.message || "Failed to check SKU" },
      { status: 500 }
    );
  }
}
