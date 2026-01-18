"use client";

import Link from "next/link";
import { Card } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useCartStore } from "@/lib/store/cart-store";
import type { CartItem as CartItemType } from "@/lib/types/cart";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    if (confirm(`Remove ${item.productName} from cart?`)) {
      removeItem(item.id);
    }
  };

  const itemTotal = item.variantPrice * item.quantity;

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          href={`/products/${item.productSlug}`}
          className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
        >
          <OptimizedImage
            src={item.productImage}
            alt={item.productName}
            fill
            preset="thumbnail"
            className="object-cover"
          />
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${item.productSlug}`}
            className="hover:text-primary transition-colors"
          >
            <h3 className="font-semibold mb-1 line-clamp-1">
              {item.productName}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-1">
            {item.productBrand}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Size: {item.variantSize}</span>
            <span>•</span>
            <span>Rs. {item.variantPrice.toLocaleString()}</span>
          </div>

          {/* Quantity Controls (Mobile) */}
          <div className="flex items-center gap-4 mt-3 md:hidden">
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="px-3 font-semibold min-w-[2.5rem] text-center text-sm">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="p-2 hover:bg-muted transition-colors"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <button
              onClick={handleRemove}
              className="text-destructive hover:text-destructive/80 transition-colors p-2"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quantity Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 font-semibold min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Item Total */}
          <div className="w-28 text-right">
            <p className="font-bold">Rs. {itemTotal.toLocaleString()}</p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="text-destructive hover:text-destructive/80 transition-colors p-2"
            aria-label="Remove item"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Item Total (Mobile) */}
      <div className="mt-3 text-right md:hidden">
        <p className="font-bold">Total: Rs. {itemTotal.toLocaleString()}</p>
      </div>
    </Card>
  );
}
