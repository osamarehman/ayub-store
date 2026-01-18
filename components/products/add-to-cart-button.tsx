"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import type { ProductWithRelations } from "@/lib/types/product";
import type { ProductVariant } from "@prisma/client";

interface AddToCartButtonProps {
  product: ProductWithRelations;
  selectedVariant: ProductVariant | undefined;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  selectedVariant,
  disabled,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const maxQuantity = selectedVariant?.stock || 0;

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    setIsLoading(true);

    // Use dynamic import to avoid SSR issues with Zustand
    const { useCartStore } = await import("@/lib/store/cart-store");
    const { addItem } = useCartStore.getState();

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productBrand: product.brand,
      productImage: product.mainImage,
      variantId: selectedVariant.id,
      variantSize: selectedVariant.size,
      variantPrice: Number(selectedVariant.price),
      variantSku: selectedVariant.sku,
      quantity,
    });

    setIsLoading(false);

    // TODO: Show success toast with proper notification system
    alert(`Added ${quantity}x ${product.name} (${selectedVariant.size}) to cart`);
  };

  return (
    <div className="space-y-3">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 font-semibold min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= maxQuantity}
            className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          "Adding..."
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart - Rs.{" "}
            {selectedVariant
              ? (Number(selectedVariant.price) * quantity).toLocaleString()
              : 0}
          </>
        )}
      </Button>
    </div>
  );
}
