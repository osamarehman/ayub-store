"use client";

import { useState } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Card } from "@/components/ui";

interface ProductImagesProps {
  mainImage: string;
  images: string[];
  productName: string;
}

export function ProductImages({
  mainImage,
  images,
  productName,
}: ProductImagesProps) {
  // Combine main image with additional images
  const allImages = [mainImage, ...images];
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden aspect-square relative">
        <OptimizedImage
          src={allImages[selectedImage]}
          alt={`${productName} - Image ${selectedImage + 1}`}
          fill
          preset="product-detail"
          className="object-cover"
          priority={selectedImage === 0}
        />
      </Card>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <OptimizedImage
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                preset="thumbnail"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
