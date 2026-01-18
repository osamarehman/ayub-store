/**
 * Upload helper for Binayub assets server
 *
 * Endpoint: https://assets.binayub.store/upload?app=binayub
 */

const ASSETS_SERVER = process.env.NEXT_PUBLIC_ASSETS_URL || "https://assets.binayub.store";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "binayub";

export async function uploadToAssetsServer(
  file: File,
  filename: string,
  category: "products" | "categories" | "banners" = "products"
): Promise<{ success: boolean; path?: string; filename?: string; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("image", file, filename);
    formData.append("category", category);

    // Upload with ?app=binayub query parameter
    const response = await fetch(`${ASSETS_SERVER}/upload?app=${APP_NAME}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload to assets server failed:", errorText);
      return {
        success: false,
        error: `Server returned ${response.status}: ${errorText}`,
      };
    }

    const result = await response.json();

    if (result.success) {
      // Build the full path for database storage
      const storedPath = result.path || `${category}/${filename}`;

      return {
        success: true,
        filename: result.filename || filename,
        path: storedPath,
        // Full URL for displaying the image
        url: getImageUrl(storedPath),
      };
    }

    return {
      success: false,
      error: result.error || "Upload failed",
    };
  } catch (error: any) {
    console.error("Error uploading to assets server:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Generate imgproxy URL for displaying images
 * Format: https://assets.binayub.store/insecure/rs:fit:{W}:{H}/plain/local:///binayub/{path}
 */
export function getImageUrl(
  path: string,
  options: { width?: number; height?: number; mode?: "fit" | "fill" } = {}
): string {
  const { width = 800, height = 0, mode = "fit" } = options;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${ASSETS_SERVER}/insecure/rs:${mode}:${width}:${height}/plain/local:///${APP_NAME}/${cleanPath}`;
}

/**
 * Preset: Product thumbnail (200x200)
 */
export function getThumbnailUrl(path: string): string {
  return getImageUrl(path, { width: 200, height: 200, mode: "fit" });
}

/**
 * Preset: Product image (800px wide)
 */
export function getProductImageUrl(path: string): string {
  return getImageUrl(path, { width: 800, height: 0, mode: "fit" });
}

/**
 * Preset: Banner image (1200x400 cropped)
 */
export function getBannerUrl(path: string): string {
  return getImageUrl(path, { width: 1200, height: 400, mode: "fill" });
}

// Keep backward compatibility with old function name
export const uploadToImgproxyServer = uploadToAssetsServer;
