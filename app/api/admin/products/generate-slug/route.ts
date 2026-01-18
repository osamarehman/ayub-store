import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { generateUniqueSlug } from "@/lib/data/admin-products";
import { generateSlug } from "@/lib/utils/format";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, baseSlug, excludeProductId } = body;

    if (!name && !baseSlug) {
      return NextResponse.json(
        { error: "Either name or baseSlug is required" },
        { status: 400 }
      );
    }

    // Generate base slug from name if not provided
    const slugBase = baseSlug || generateSlug(name);

    // Generate unique slug
    const uniqueSlug = await generateUniqueSlug(slugBase, excludeProductId);

    return NextResponse.json({
      slug: uniqueSlug,
    });
  } catch (error: any) {
    console.error("Error generating slug:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate slug" },
      { status: 500 }
    );
  }
}
