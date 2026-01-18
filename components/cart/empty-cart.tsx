import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { ShoppingCart } from "lucide-react";

export function EmptyCart() {
  return (
    <Card className="p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6">
        Looks like you haven't added any items to your cart yet.
      </p>
      <Link href="/products">
        <Button size="lg">Start Shopping</Button>
      </Link>
    </Card>
  );
}
