"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/lib/store/cart-store";
import { createOrder } from "@/lib/actions/orders";
import { checkoutSchema, type CheckoutInput } from "@/lib/schemas/checkout";
import { Button, Card } from "@/components/ui";
import { ShippingForm } from "./shipping-form";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function CheckoutForm({ user }: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      paymentMethod: "WHATSAPP",
    },
  });

  const selectedCity = watch("city");

  // Check if cart is empty
  if (cartItems.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">
          Please add items to your cart before checking out.
        </p>
        <Button onClick={() => router.push("/products")}>Shop Now</Button>
      </Card>
    );
  }

  const onSubmit = async (data: CheckoutInput) => {
    setError(undefined);
    setIsSubmitting(true);

    try {
      const result = await createOrder(data, cartItems);

      if (result.success && result.orderNumber) {
        // Clear cart
        clearCart();

        // Redirect to order confirmation
        router.push(`/orders/${result.orderNumber}`);
      } else {
        setError(result.error || "Failed to create order");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <ShippingForm
            register={register}
            errors={errors}
            selectedCity={selectedCity}
          />

          {/* Payment Method */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
              <input
                type="hidden"
                value="WHATSAPP"
                {...register("paymentMethod")}
              />
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-success"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold">WhatsApp Order Confirmation</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    After placing your order, you'll be redirected to a confirmation page with a WhatsApp button.
                    Click it to send your order details directly to our team for payment confirmation.
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    We'll share our bank account details via WhatsApp so you can complete the payment.
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Special Instructions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
            <textarea
              {...register("notes")}
              placeholder="Any special requests or delivery instructions..."
              rows={4}
              className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="p-4 bg-destructive/10 border-destructive">
              <p className="text-sm text-destructive">{error}</p>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <CheckoutOrderSummary
            cartItems={cartItems}
            selectedCity={selectedCity}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
}
