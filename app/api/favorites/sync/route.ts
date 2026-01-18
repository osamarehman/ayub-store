import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

// POST - Sync local favorites to database when user logs in
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { productIds } = await request.json();

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "Product IDs array is required" },
        { status: 400 }
      );
    }

    // Filter to only valid product IDs
    const validProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      select: { id: true },
    });

    const validProductIds = validProducts.map((p) => p.id);

    // Upsert each product to wishlist
    for (const productId of validProductIds) {
      await prisma.wishlist.upsert({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId,
          },
        },
        update: {},
        create: {
          userId: session.user.id,
          productId,
        },
      });
    }

    // Get all user's favorites after sync
    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });

    return NextResponse.json({
      success: true,
      productIds: wishlistItems.map((item) => item.productId),
    });
  } catch (error) {
    console.error("Error syncing favorites:", error);
    return NextResponse.json(
      { error: "Failed to sync favorites" },
      { status: 500 }
    );
  }
}
