import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { Settings as SettingsIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your preferences and settings
        </p>
      </div>

      {/* Coming Soon */}
      <Card className="p-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Account settings and preferences will be available soon. You'll be able to
            manage notifications, privacy settings, and more.
          </p>
        </div>
      </Card>
    </div>
  );
}
