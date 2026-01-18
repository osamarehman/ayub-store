import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { prisma } from "@/lib/db/prisma";

const ASSETS_SERVER_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "https://assets.binayub.store";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "binayub";

// Helper to get image dimensions from buffer
async function getImageDimensions(buffer: Buffer, mimeType: string): Promise<{ width: number; height: number } | null> {
  try {
    // Simple dimension extraction for common formats
    if (mimeType === "image/png") {
      if (buffer.length > 24 && buffer.toString("hex", 0, 8) === "89504e470d0a1a0a") {
        const width = buffer.readUInt32BE(16);
        const height = buffer.readUInt32BE(20);
        return { width, height };
      }
    } else if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      let i = 0;
      if (buffer[i] === 0xff && buffer[i + 1] === 0xd8) {
        i += 2;
        while (i < buffer.length) {
          if (buffer[i] !== 0xff) break;
          const marker = buffer[i + 1];
          if (marker === 0xc0 || marker === 0xc2) {
            const height = buffer.readUInt16BE(i + 5);
            const width = buffer.readUInt16BE(i + 7);
            return { width, height };
          }
          const length = buffer.readUInt16BE(i + 2);
          i += length + 2;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop();
    const filename = `${category}-${timestamp}-${randomString}.${extension}`;

    // Try uploading to assets server first
    try {
      const uploadFormData = new FormData();
      const blob = new Blob([buffer], { type: file.type });

      // Rename file for upload
      const renamedFile = new File([blob], filename, { type: file.type });
      uploadFormData.append("image", renamedFile);
      uploadFormData.append("category", category);

      // Upload with ?app=binayub query parameter
      const uploadResponse = await fetch(`${ASSETS_SERVER_URL}/upload?app=${APP_NAME}`, {
        method: "POST",
        body: uploadFormData,
      });

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();

        if (uploadResult.success) {
          // Use the path returned by the server
          const uploadedFilename = uploadResult.filename || filename;
          const imagePath = uploadResult.path || `${category}/${uploadedFilename}`;

          console.log("Image uploaded to assets server:", imagePath);

          // Get image dimensions
          const dimensions = await getImageDimensions(buffer, file.type);

          // Create asset record
          const asset = await prisma.asset.create({
            data: {
              filename: uploadedFilename,
              path: imagePath,
              url: imagePath,
              name: file.name.replace(/\.[^/.]+$/, ""), // Original name without extension
              size: file.size,
              width: dimensions?.width,
              height: dimensions?.height,
              mimeType: file.type,
              category: category,
            },
          });

          return NextResponse.json({
            success: true,
            path: imagePath,
            filename: uploadedFilename,
            uploadedTo: "assets-server",
            asset,
          });
        }
      } else {
        const errorText = await uploadResponse.text();
        console.warn("Assets server upload failed:", errorText);
        console.warn("Falling back to local storage");
      }
    } catch (uploadError) {
      console.warn("Assets server unavailable, using local storage:", uploadError);
    }

    // Fallback: Save locally (development mode)
    // Store in public/uploads/{category}/ for local development
    const uploadsDir = join(process.cwd(), "public", "uploads", category);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Store path as "{category}/filename.ext" for consistency with assets server
    const imagePath = `${category}/${filename}`;

    console.log("Image saved locally to:", `public/uploads/${category}/${filename}`);
    console.log("Stored with path:", imagePath);

    // Get image dimensions
    const dimensions = await getImageDimensions(buffer, file.type);

    // Create asset record
    const asset = await prisma.asset.create({
      data: {
        filename,
        path: imagePath,
        url: `/uploads/${category}/${filename}`, // Local URL for development
        name: file.name.replace(/\.[^/.]+$/, ""), // Original name without extension
        size: file.size,
        width: dimensions?.width,
        height: dimensions?.height,
        mimeType: file.type,
        category: category,
      },
    });

    return NextResponse.json({
      success: true,
      path: imagePath,
      filename,
      uploadedTo: "local-development",
      asset,
      note: `Sync public/uploads/${category}/ to assets server for production`,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
