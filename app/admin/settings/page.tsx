import type { Metadata } from "next";
import { Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Settings - Admin",
  description: "Manage store settings",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your store settings
        </p>
      </div>

      <Card className="p-12 text-center">
        <p className="text-muted-foreground">
          Settings management coming soon...
        </p>
      </Card>
    </div>
  );
}
