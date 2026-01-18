import type { Metadata } from "next";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Customers - Admin",
  description: "Manage customers",
};

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Customers</h1>
        <p className="text-muted-foreground">
          Manage customer accounts and information
        </p>
      </div>

      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          Customer management coming soon...
        </p>
      </Card>
    </div>
  );
}
