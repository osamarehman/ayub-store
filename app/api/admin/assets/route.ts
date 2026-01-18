import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { readdir, stat, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { prisma } from "@/lib/db/prisma";

const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_IMGPROXY_URL || "https://assets.binayub.com";

// GET - List all assets (from database + local files)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assets: any[] = [];
    const seenPaths = new Set<string>();

    // First, get assets from the Asset table
    try {
      const dbAssets = await prisma.asset.findMany({
        orderBy: { createdAt: "desc" },
      });

      for (const asset of dbAssets) {
        if (!seenPaths.has(asset.path)) {
          seenPaths.add(asset.path);
          assets.push({
            id: asset.id,
            filename: asset.filename,
            path: asset.path,
            url: asset.url,
            name: asset.name,
            altText: asset.altText,
            size: asset.size,
            width: asset.width,
            height: asset.height,
            mimeType: asset.mimeType,
            category: asset.category,
            createdAt: asset.createdAt.toISOString(),
            updatedAt: asset.updatedAt.toISOString(),
            source: "database",
          });
        }
      }
    } catch (dbError) {
      console.warn("Could not fetch assets from database:", dbError);
    }

    // Helper to get file size from local storage
    const getLocalFileSize = async (imagePath: string): Promise<number> => {
      try {
        // imagePath is like "products/filename.jpg"
        const filename = imagePath.split("/").pop();
        if (!filename) return 0;
        const localPath = join(process.cwd(), "public", "uploads", "products", filename);
        if (existsSync(localPath)) {
          const stats = await stat(localPath);
          return stats.size;
        }
      } catch {
        // File doesn't exist locally
      }
      return 0;
    };

    // Get images from products (for backwards compatibility)
    try {
      const products = await prisma.product.findMany({
        select: {
          mainImage: true,
          images: true,
          name: true,
          createdAt: true,
        },
      });

      for (const product of products) {
        // Add main image
        if (product.mainImage && !seenPaths.has(product.mainImage)) {
          seenPaths.add(product.mainImage);
          const filename = product.mainImage.split("/").pop() || product.mainImage;
          const fileSize = await getLocalFileSize(product.mainImage);
          assets.push({
            id: `product-${product.mainImage}`,
            filename,
            path: product.mainImage,
            url: product.mainImage,
            name: filename.replace(/\.[^/.]+$/, ""), // Remove extension
            altText: product.name,
            size: fileSize,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.createdAt.toISOString(),
            usedIn: product.name,
            source: "product",
          });
        }

        // Add additional images
        const images = product.images as string[] || [];
        for (const img of images) {
          if (img && !seenPaths.has(img)) {
            seenPaths.add(img);
            const filename = img.split("/").pop() || img;
            const fileSize = await getLocalFileSize(img);
            assets.push({
              id: `product-${img}`,
              filename,
              path: img,
              url: img,
              name: filename.replace(/\.[^/.]+$/, ""),
              altText: product.name,
              size: fileSize,
              createdAt: product.createdAt.toISOString(),
              updatedAt: product.createdAt.toISOString(),
              usedIn: product.name,
              source: "product",
            });
          }
        }
      }
    } catch (dbError) {
      console.warn("Could not fetch images from products:", dbError);
    }

    // Also check local files
    const uploadsDir = join(process.cwd(), "public", "uploads", "products");
    if (existsSync(uploadsDir)) {
      const files = await readdir(uploadsDir);
      const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

      for (const file of files) {
        const ext = file.toLowerCase().slice(file.lastIndexOf("."));
        if (imageExtensions.includes(ext)) {
          const path = `products/${file}`;
          if (!seenPaths.has(path)) {
            seenPaths.add(path);
            const filepath = join(uploadsDir, file);
            const stats = await stat(filepath);
            assets.push({
              id: `local-${file}`,
              filename: file,
              path,
              url: `/uploads/products/${file}`,
              name: file.replace(/\.[^/.]+$/, ""),
              size: stats.size,
              createdAt: stats.birthtime.toISOString(),
              updatedAt: stats.mtime.toISOString(),
              source: "local",
            });
          }
        }
      }
    }

    // Sort by creation date (newest first)
    assets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      assets,
      serverUrl: ASSETS_SERVER_URL,
    });
  } catch (error: any) {
    console.error("Error listing assets:", error);
    return NextResponse.json(
      { error: error.message || "Failed to list assets" },
      { status: 500 }
    );
  }
}

// POST - Create/update asset metadata
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { path, name, altText, filename, url, size, width, height, mimeType, category } = data;

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    // Upsert the asset
    const asset = await prisma.asset.upsert({
      where: { path },
      update: {
        name: name || undefined,
        altText: altText || undefined,
        size: size || undefined,
        width: width || undefined,
        height: height || undefined,
      },
      create: {
        path,
        filename: filename || path.split("/").pop() || path,
        url: url || path,
        name: name || path.split("/").pop()?.replace(/\.[^/.]+$/, "") || "Untitled",
        altText,
        size: size || 0,
        width,
        height,
        mimeType,
        category: category || "products",
      },
    });

    return NextResponse.json({ success: true, asset });
  } catch (error: any) {
    console.error("Error saving asset:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save asset" },
      { status: 500 }
    );
  }
}

// PATCH - Update asset metadata and propagate to products
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, altText } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Asset ID is required" }, { status: 400 });
    }

    // Update the asset
    const asset = await prisma.asset.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        altText: altText !== undefined ? altText : undefined,
      },
    });

    // Note: Since products store paths directly, the alt text won't automatically
    // update in products. The alt text from Asset can be used when rendering
    // by looking up the asset by path.

    return NextResponse.json({ success: true, asset });
  } catch (error: any) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update asset" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an asset
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const filename = searchParams.get("filename");

    if (!id && !filename) {
      return NextResponse.json({ error: "ID or filename is required" }, { status: 400 });
    }

    // Delete from database if it exists
    if (id && !id.startsWith("local-") && !id.startsWith("product-")) {
      try {
        await prisma.asset.delete({ where: { id } });
      } catch (e) {
        // Asset might not exist in database
      }
    }

    // Try to delete from imgproxy server
    if (filename) {
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");

      try {
        const response = await fetch(`${ASSETS_SERVER_URL}/api/images/${sanitizedFilename}?category=products`, {
          method: "DELETE",
        });

        if (response.ok) {
          return NextResponse.json({
            success: true,
            message: "Asset deleted from server",
          });
        }
      } catch (error) {
        console.warn("imgproxy server unavailable, trying local storage");
      }

      // Fallback: Delete from local storage
      const filepath = join(process.cwd(), "public", "uploads", "products", sanitizedFilename);

      if (existsSync(filepath)) {
        await unlink(filepath);
        return NextResponse.json({
          success: true,
          message: "Asset deleted from local storage",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Asset deleted",
    });
  } catch (error: any) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete asset" },
      { status: 500 }
    );
  }
}
