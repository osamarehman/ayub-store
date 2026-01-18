import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { productFormSchema } from "@/lib/validations/product";
import { getProductById, updateProduct, deleteProduct, checkSlugExists } from "@/lib/data/admin-products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = productFormSchema.parse(body);

    // Check if slug already exists (excluding current product)
    const slugExists = await checkSlugExists(validatedData.slug, id);
    if (slugExists) {
      return NextResponse.json(
        { error: "A product with this slug already exists. Please use a unique slug." },
        { status: 400 }
      );
    }

    const product = await updateProduct(id, validatedData);

    return NextResponse.json({
      success: true,
      product,
      message: "Product updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating product:", error);

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
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
