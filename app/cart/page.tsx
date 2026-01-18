import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { CartContent } from "@/components/cart/cart-content";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your cart and proceed to checkout",
};

export default function CartPage() {
  return (
    <div className="py-12">
      <Container>
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <CartContent />
      </Container>
    </div>
  );
}
