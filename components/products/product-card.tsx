"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/optimized-image";
import type { ProductListItem } from "@/lib/types/product";
import { ShoppingCart, Heart } from "lucide-react";
import { useFavoritesStore } from "@/lib/store/favorites-store";
import { cn } from "@/lib/utils/cn";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isProductFavorite = isFavorite(product.id);

  // Get the cheapest variant price
  const minPrice =
    product.variants.length > 0
      ? Math.min(...product.variants.map((v) => Number(v.price)))
      : Number(product.basePrice);

  // Check if any variant is in stock
  const inStock = product.variants.some((v) => v.stock > 0);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(product.id);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <OptimizedImage
            src={product.mainImage}
            alt={product.name}
            fill
            preset="product"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isFeatured && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                Featured
              </span>
            )}
            {!inStock && (
              <span className="bg-destructive text-white text-xs font-bold px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            className={cn(
              "absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110",
              isProductFavorite
                ? "opacity-100 text-red-500"
                : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500"
            )}
            onClick={handleFavoriteClick}
            aria-label={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={cn("h-4 w-4", isProductFavorite && "fill-current")}
            />
          </button>

          {/* Quick Add Button */}
          {inStock && (
            <button
              className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                // This will be implemented with cart functionality
                console.log("Quick add:", product.id);
              }}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4 text-primary" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.brand}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">Rs. {minPrice.toLocaleString()}</span>
              {product.variants.length > 1 && (
                <span className="text-xs text-muted-foreground ml-1">+</span>
              )}
            </div>
            {product.variants.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {product.variants.length} size{product.variants.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
