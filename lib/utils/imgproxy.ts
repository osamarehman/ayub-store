/**
 * Imgproxy URL generation for Binayub assets
 *
 * URL Format: https://assets.binayub.store/insecure/rs:fit:{W}:{H}/plain/local:///binayub/{path}
 */

const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "https://assets.binayub.store";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "binayub";

export type ImgproxyOptions = {
  width?: number;
  height?: number;
  resizeType?: "fit" | "fill" | "fill-down" | "force" | "auto";
  gravity?: "no" | "so" | "ea" | "we" | "noea" | "nowe" | "soea" | "sowe" | "ce" | "sm";
  enlarge?: boolean;
  quality?: number;
  format?: "webp" | "jpg" | "png" | "avif";
};

/**
 * Generate an imgproxy URL for Binayub assets
 * @param path - Image path (e.g., "products/filename.jpg")
 * @param options - Image processing options
 * @returns imgproxy URL
 */
export function generateImgproxyUrl(
  path: string,
  options: ImgproxyOptions = {}
): string {
  const {
    width = 600,
    height = 600,
    resizeType = "fit",
    quality = 90,
    format = "webp",
    enlarge = false,
  } = options;

  // Clean path (remove leading slash if present)
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // If no assets URL is configured, serve directly from public folder (fallback only)
  if (!ASSETS_URL) {
    // Check if it's stored in local uploads directory
    if (cleanPath.startsWith("products/")) {
      return `/uploads/${cleanPath}`;
    }
    return `/${cleanPath}`;
  }

  // Build the imgproxy URL using the plain source format
  // Format: /insecure/rs:{mode}:{width}:{height}/plain/local:///binayub/{path}
  const processingOptions = `rs:${resizeType}:${width}:${height}`;

  // Return the full imgproxy URL with local:/// source
  return `${ASSETS_URL}/insecure/${processingOptions}/plain/local:///${APP_NAME}/${cleanPath}`;
}

/**
 * Preset: Product thumbnail (small square)
 */
export function getProductThumbnail(imagePath: string): string {
  return generateImgproxyUrl(imagePath, {
    width: 300,
    height: 300,
    resizeType: "fill",
    quality: 85,
    format: "webp",
  });
}

/**
 * Preset: Product image (medium)
 */
export function getProductImage(imagePath: string): string {
  return generateImgproxyUrl(imagePath, {
    width: 600,
    height: 600,
    resizeType: "fit",
    quality: 90,
    format: "webp",
  });
}

/**
 * Preset: Product detail image (large)
 */
export function getProductDetailImage(imagePath: string): string {
  return generateImgproxyUrl(imagePath, {
    width: 1200,
    height: 1200,
    resizeType: "fit",
    quality: 90,
    format: "webp",
  });
}

/**
 * Preset: Hero/banner image
 */
export function getHeroImage(imagePath: string): string {
  return generateImgproxyUrl(imagePath, {
    width: 1920,
    height: 800,
    resizeType: "fill",
    quality: 85,
    format: "webp",
  });
}

/**
 * Preset: Category card image
 */
export function getCategoryImage(imagePath: string): string {
  return generateImgproxyUrl(imagePath, {
    width: 800,
    height: 600,
    resizeType: "fill",
    quality: 85,
    format: "webp",
  });
}

/**
 * Get image URL with custom dimensions
 * Simpler helper for common use cases
 */
export function getImageUrl(
  path: string,
  options: { width?: number; height?: number; mode?: "fit" | "fill" } = {}
): string {
  const { width = 800, height = 0, mode = "fit" } = options;
  return generateImgproxyUrl(path, {
    width,
    height,
    resizeType: mode,
  });
}
