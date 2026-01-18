import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// POST - Get multiple products by IDs
export async function POST(request: Request) {
  try {
    const { productIds } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        mainImage: true,
        brand: true,
        basePrice: true,
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            size: true,
            price: true,
            stock: true,
          },
          orderBy: { price: "asc" },
        },
      },
    });

    // Serialize Decimal to Number
    const serializedProducts = products.map((product) => ({
      ...product,
      basePrice: Number(product.basePrice),
      variants: product.variants.map((v) => ({
        ...v,
        price: Number(v.price),
      })),
    }));

    return NextResponse.json({ products: serializedProducts });
  } catch (error) {
    console.error("Error fetching products batch:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
