"use client";

import Link from "next/link";
import { Card, Button } from "@/components/ui";
import { useCartStore } from "@/lib/store/cart-store";
import { ShoppingBag, Truck } from "lucide-react";

const SHIPPING_THRESHOLD = 3000;

export function CartSummary() {
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const shippingCost = useCartStore((state) => state.getShippingCost());
  const grandTotal = useCartStore((state) => state.getGrandTotal());

  const amountUntilFreeShipping = SHIPPING_THRESHOLD - cartTotal;
  const hasFreeShipping = shippingCost === 0;

  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Shipping Progress */}
      {!hasFreeShipping && amountUntilFreeShipping > 0 && (
        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <Truck className="h-4 w-4 text-primary mt-0.5" />
            <p className="text-sm">
              Add <span className="font-bold">Rs. {amountUntilFreeShipping.toLocaleString()}</span> more for{" "}
              <span className="font-bold text-primary">FREE shipping</span>!
            </p>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-border rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((cartTotal / SHIPPING_THRESHOLD) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {hasFreeShipping && (
        <div className="mb-6 p-4 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center gap-2 text-success">
            <Truck className="h-4 w-4" />
            <p className="text-sm font-medium">You qualify for FREE shipping!</p>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">Rs. {cartTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {hasFreeShipping ? (
              <span className="text-success">FREE</span>
            ) : (
              `Rs. ${shippingCost.toLocaleString()}`
            )}
          </span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">Rs. {grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button size="lg" className="w-full mb-3">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/products">
        <Button variant="outline" size="lg" className="w-full">
          Continue Shopping
        </Button>
      </Link>

      {/* Payment Info */}
      <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
        <p>We accept Cash on Delivery (COD)</p>
        <p className="mt-1">Secure checkout guaranteed</p>
      </div>
    </Card>
  );
}
