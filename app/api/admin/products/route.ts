import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { productFormSchema } from "@/lib/validations/product";
import { createProduct, getAllProducts, checkSlugExists } from "@/lib/data/admin-products";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = productFormSchema.parse(body);

    // Check if slug already exists
    const slugExists = await checkSlugExists(validatedData.slug);
    if (slugExists) {
      return NextResponse.json(
        { error: "A product with this slug already exists. Please use a unique slug." },
        { status: 400 }
      );
    }

    const product = await createProduct(validatedData);

    return NextResponse.json({
      success: true,
      product,
      message: "Product created successfully",
    });
  } catch (error: any) {
    console.error("Error creating product:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (target?.includes("slug")) {
        return NextResponse.json(
          { error: "A product with this slug already exists. Please use a different slug." },
          { status: 400 }
        );
      }
      if (target?.includes("sku")) {
        return NextResponse.json(
          { error: "A variant with this SKU already exists. Please use a unique SKU for each variant." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "A product with these details already exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
