"use client";

import { useState } from "react";
import { Badge, Button } from "@/components/ui";
import { Heart, Share2, Check } from "lucide-react";
import type { ProductWithRelations } from "@/lib/types/product";
import { VariantSelector } from "./variant-selector";
import { AddToCartButton } from "./add-to-cart-button";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { cn } from "@/lib/utils/cn";

interface ProductInfoProps {
  product: ProductWithRelations;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants[0]?.id || null
  );
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isProductFavorite = isFavorite(product.id);

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  );

  const handleFavoriteClick = async () => {
    await toggleFavorite(product.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} by ${product.brand}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      <div>
        <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
          {product.brand}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

        {/* Category Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.gender && (
            <Badge variant="outline">{product.gender}</Badge>
          )}
          {product.categories.map((category) => (
            <Badge key={category.id} variant="outline">
              {category.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        {selectedVariant ? (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              Rs. {Number(selectedVariant.price).toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              {selectedVariant.size}
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              Rs. {Number(product.basePrice).toLocaleString()}
            </span>
          </div>
        )}

        {/* Stock Status */}
        {selectedVariant && (
          <div className="mt-2">
            {selectedVariant.stock > 0 ? (
              <div className="flex items-center gap-2 text-sm text-success">
                <Check className="h-4 w-4" />
                <span>In Stock ({selectedVariant.stock} available)</span>
              </div>
            ) : (
              <div className="text-sm text-destructive">Out of Stock</div>
            )}
          </div>
        )}
      </div>

      {/* Variant Selector */}
      {product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          selectedVariantId={selectedVariantId}
          onVariantChange={setSelectedVariantId}
        />
      )}

      {/* Add to Cart & Actions */}
      <div className="space-y-3">
        <AddToCartButton
          product={product}
          selectedVariant={selectedVariant}
          disabled={!selectedVariant || selectedVariant.stock === 0}
        />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleFavoriteClick}
            className={cn(
              isProductFavorite && "text-red-500 border-red-200 hover:border-red-300"
            )}
          >
            <Heart
              className={cn("h-4 w-4", isProductFavorite && "fill-current")}
            />
          </Button>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="pt-6 border-t space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <Check className="h-4 w-4 text-success mt-0.5" />
          <span>Free delivery on orders over Rs. 3,000</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Check className="h-4 w-4 text-success mt-0.5" />
          <span>Cash on Delivery available</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Check className="h-4 w-4 text-success mt-0.5" />
          <span>Easy returns within 7 days</span>
        </div>
      </div>
    </div>
  );
}
