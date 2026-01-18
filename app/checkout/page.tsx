import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { Container } from "@/components/ui";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order",
};

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  return (
    <div className="py-12">
      <Container>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutForm user={session.user} />
      </Container>
    </div>
  );
}
