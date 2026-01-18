"use client";

import { Card, Button } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { calculateShipping } from "@/lib/utils/order";
import type { CartItem } from "@/lib/types/cart";
import { Loader2, Lock } from "lucide-react";

interface CheckoutOrderSummaryProps {
  cartItems: CartItem[];
  selectedCity?: string;
  isSubmitting: boolean;
}

export function CheckoutOrderSummary({
  cartItems,
  selectedCity,
  isSubmitting,
}: CheckoutOrderSummaryProps) {
  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.variantPrice * item.quantity,
    0
  );

  const shippingCost = selectedCity ? calculateShipping(selectedCity, subtotal) : 200;
  const total = subtotal + shippingCost;

  return (
    <Card className="p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
              <OptimizedImage
                src={item.productImage}
                alt={item.productName}
                fill
                preset="thumbnail"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium line-clamp-1">
                {item.productName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {item.variantSize} × {item.quantity}
              </p>
              <p className="text-sm font-semibold">
                Rs. {(item.variantPrice * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t pt-4 space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shippingCost === 0 ? (
              <span className="text-success">FREE</span>
            ) : (
              `Rs. ${shippingCost.toLocaleString()}`
            )}
          </span>
        </div>
        {!selectedCity && (
          <p className="text-xs text-muted-foreground">
            *Select city to calculate shipping cost
          </p>
        )}
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">Rs. {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="h-5 w-5 mr-2" />
            Place Order
          </>
        )}
      </Button>

      {/* Security Note */}
      <p className="text-xs text-center text-muted-foreground mt-4">
        Your order information is secure and encrypted
      </p>
    </Card>
  );
}
