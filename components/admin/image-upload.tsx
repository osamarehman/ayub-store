"use client";

import { Button, Card } from "@/components/ui";
import { Plus, X, Upload, Loader2, Check, AlertTriangle, ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { getProductImage } from "@/lib/utils/imgproxy";
import { cn } from "@/lib/utils/cn";

interface ImageDimensionInfo {
  width: number;
  height: number;
  isOptimal: boolean;
  aspectRatio: string;
}

interface ImageUploadProps {
  mainImage: string;
  images: string[];
  onMainImageChange: (url: string) => void;
  onImagesChange: (urls: string[]) => void;
  mainImageError?: string;
}

export function ImageUpload({
  mainImage,
  images,
  onMainImageChange,
  onImagesChange,
  mainImageError,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingAdditional, setUploadingAdditional] = useState(false);
  const [mainImageDimensions, setMainImageDimensions] = useState<ImageDimensionInfo | null>(null);
  const [additionalImageDimensions, setAdditionalImageDimensions] = useState<Record<number, ImageDimensionInfo>>({});
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImageInputRef = useRef<HTMLInputElement>(null);

  // Check image dimensions before upload
  const checkImageDimensions = (file: File, type: 'main' | 'additional'): Promise<ImageDimensionInfo> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const minSize = type === 'main' ? 1200 : 600;
        const isSquare = Math.abs(width - height) < 50; // Allow small variance for "square"
        const isLargeEnough = width >= minSize && height >= minSize;
        const isOptimal = isSquare && isLargeEnough;

        // Calculate aspect ratio
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(width, height);
        const aspectRatio = `${width / divisor}:${height / divisor}`;

        URL.revokeObjectURL(img.src);
        resolve({ width, height, isOptimal, aspectRatio });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Show specific error messages
        if (data.error) {
          toast.error(data.error);
        } else if (response.status === 413) {
          toast.error("File too large. Maximum size is 5MB.");
        } else if (response.status === 415) {
          toast.error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        } else {
          toast.error("Failed to upload image");
        }
        return null;
      }

      toast.success("Image uploaded successfully");

      // Handle different path formats from server
      // imgproxy server may return "/products/filename.jpg" or "products/filename.jpg"
      const imagePath = data.path || data.url;
      const displayPath = imagePath.startsWith('http') || imagePath.startsWith('/')
        ? imagePath
        : `/${imagePath}`;

      return displayPath;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 5MB.");
      return false;
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return false;
    }

    return true;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      // Reset input
      if (mainImageInputRef.current) {
        mainImageInputRef.current.value = "";
      }
      return;
    }

    // Check dimensions before upload
    const dimensions = await checkImageDimensions(file, 'main');
    setMainImageDimensions(dimensions);

    // Show appropriate message based on dimensions
    if (!dimensions.isOptimal) {
      toast((t) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">Image will be transformed</span>
          <span className="text-sm text-muted-foreground">
            Your image ({dimensions.width}x{dimensions.height}px) will be automatically resized.
            For best results, use 1200x1200px square images.
          </span>
        </div>
      ), {
        duration: 5000,
        icon: '⚠️',
      });
    }

    setUploading(true);
    const url = await uploadImage(file);
    setUploading(false);

    if (url) {
      onMainImageChange(url);
    }

    // Reset input
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      // Reset input
      if (additionalImageInputRef.current) {
        additionalImageInputRef.current.value = "";
      }
      return;
    }

    // Check dimensions before upload
    const dimensions = await checkImageDimensions(file, 'additional');
    const newIndex = images.length;

    // Show appropriate message based on dimensions
    if (!dimensions.isOptimal) {
      toast((t) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium">Image will be transformed</span>
          <span className="text-sm text-muted-foreground">
            Your image ({dimensions.width}x{dimensions.height}px) will be automatically resized.
            For best results, use 600x600px square images.
          </span>
        </div>
      ), {
        duration: 5000,
        icon: '⚠️',
      });
    }

    setUploadingAdditional(true);
    const url = await uploadImage(file);
    setUploadingAdditional(false);

    if (url) {
      onImagesChange([...images, url]);
      setAdditionalImageDimensions(prev => ({
        ...prev,
        [newIndex]: dimensions
      }));
    }

    // Reset input
    if (additionalImageInputRef.current) {
      additionalImageInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  // Helper function to get display URL for preview
  const getDisplayUrl = (path: string) => {
    if (!path) return "";
    // For external URLs, use as-is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    // For all product images, use imgproxy to generate optimized URL
    return getProductImage(path);
  };

  return (
    <div className="space-y-6">
      {/* Image Guidelines with Visual Indicators */}
      <div className="p-4 bg-muted/50 rounded-lg border space-y-4">
        <h4 className="text-sm font-medium">Image Upload Guidelines</h4>

        {/* Visual Dimension Guides */}
        <div className="grid grid-cols-2 gap-4">
          {/* Main Image Guide */}
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
            <div className="w-14 h-14 border-2 border-dashed border-primary/50 rounded flex items-center justify-center bg-primary/5 flex-shrink-0">
              <div className="text-center">
                <ImageIcon className="h-4 w-4 text-primary mx-auto mb-0.5" />
                <span className="text-[8px] text-primary font-medium">1:1</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Main Image</p>
              <p className="text-xs text-muted-foreground">1200 x 1200 px</p>
              <p className="text-[10px] text-muted-foreground">Square format recommended</p>
            </div>
          </div>

          {/* Additional Images Guide */}
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
            <div className="w-12 h-12 border-2 border-dashed border-muted-foreground/50 rounded flex items-center justify-center bg-muted flex-shrink-0">
              <div className="text-center">
                <ImageIcon className="h-3 w-3 text-muted-foreground mx-auto mb-0.5" />
                <span className="text-[8px] text-muted-foreground font-medium">1:1</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Additional</p>
              <p className="text-xs text-muted-foreground">600 x 600 px+</p>
              <p className="text-[10px] text-muted-foreground">Square format recommended</p>
            </div>
          </div>
        </div>

        {/* Text Guidelines */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p><span className="font-medium">Formats:</span> JPEG, PNG, or WebP only</p>
          <p><span className="font-medium">Max size:</span> 5MB per image</p>
          <p><span className="font-medium">Note:</span> Images will be automatically transformed if not in optimal dimensions, but may not display as intended</p>
        </div>
      </div>

      {/* Main Image */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Main Product Image</h3>
        <p className="text-xs text-muted-foreground mb-4">Optimal: 1200x1200px (square, 1:1 ratio)</p>

        <input
          ref={mainImageInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleMainImageUpload}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => mainImageInputRef.current?.click()}
          disabled={uploading}
          className="w-full mb-4"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Main Image
            </>
          )}
        </Button>

        {mainImageError && (
          <p className="text-sm text-error mb-4">{mainImageError}</p>
        )}

        {mainImage && (
          <Card className="p-4">
            <img
              src={getDisplayUrl(mainImage)}
              alt="Main product"
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.svg";
              }}
            />
            {mainImageDimensions && (
              <div
                className={cn(
                  "mt-3 text-xs px-3 py-1.5 rounded-md inline-flex items-center gap-1.5",
                  mainImageDimensions.isOptimal
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-amber-100 text-amber-700 border border-amber-200"
                )}
              >
                {mainImageDimensions.isOptimal ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                <span>
                  {mainImageDimensions.width} x {mainImageDimensions.height}px
                  ({mainImageDimensions.aspectRatio})
                </span>
                {!mainImageDimensions.isOptimal && (
                  <span className="text-[10px] ml-1">• Transformed from original</span>
                )}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Additional Images */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Additional Images</h3>
        <p className="text-xs text-muted-foreground mb-4">Optimal: 600x600px or larger (square, 1:1 ratio)</p>

        <input
          ref={additionalImageInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleAdditionalImageUpload}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => additionalImageInputRef.current?.click()}
          disabled={uploadingAdditional}
          className="w-full mb-4"
        >
          {uploadingAdditional ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Additional Image
            </>
          )}
        </Button>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((url, index) => {
              const dims = additionalImageDimensions[index];
              return (
                <Card key={index} className="relative p-2">
                  <img
                    src={getDisplayUrl(url)}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.svg";
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute top-3 right-3"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {dims && (
                    <div
                      className={cn(
                        "mt-2 text-[10px] px-2 py-1 rounded inline-flex items-center gap-1",
                        dims.isOptimal
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      )}
                    >
                      {dims.isOptimal ? (
                        <Check className="h-2.5 w-2.5" />
                      ) : (
                        <AlertTriangle className="h-2.5 w-2.5" />
                      )}
                      {dims.width}x{dims.height}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
