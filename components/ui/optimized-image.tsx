"use client";

import Image, { ImageProps } from "next/image";
import {
  generateImgproxyUrl,
  getProductThumbnail,
  getProductImage,
  getProductDetailImage,
  getHeroImage,
  getCategoryImage,
  type ImgproxyOptions,
} from "@/lib/utils/imgproxy";

export type OptimizedImagePreset =
  | "thumbnail"
  | "product"
  | "product-detail"
  | "hero"
  | "category"
  | "custom";

export interface OptimizedImageProps extends Omit<ImageProps, "src"> {
  src: string;
  preset?: OptimizedImagePreset;
  imgproxyOptions?: ImgproxyOptions;
}

/**
 * OptimizedImage Component
 * Automatically generates imgproxy URLs for optimized image delivery
 *
 * @example
 * <OptimizedImage src="/products/perfume.jpg" preset="product" alt="Perfume" />
 */
export function OptimizedImage({
  src,
  alt,
  preset = "product",
  imgproxyOptions,
  ...props
}: OptimizedImageProps) {
  // Generate optimized image URL based on preset
  const getOptimizedSrc = (): string => {
    // If it's already an external URL, return as-is
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }

    switch (preset) {
      case "thumbnail":
        return getProductThumbnail(src);
      case "product":
        return getProductImage(src);
      case "product-detail":
        return getProductDetailImage(src);
      case "hero":
        return getHeroImage(src);
      case "category":
        return getCategoryImage(src);
      case "custom":
        return generateImgproxyUrl(src, imgproxyOptions);
      default:
        return getProductImage(src);
    }
  };

  const optimizedSrc = getOptimizedSrc();

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      {...props}
    />
  );
}
