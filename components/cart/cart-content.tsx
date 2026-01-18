"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { EmptyCart } from "./empty-cart";

export function CartContent() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
}
