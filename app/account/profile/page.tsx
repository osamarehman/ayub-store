import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui";
import { User, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your profile information",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          View and manage your account information
        </p>
      </div>

      {/* Profile Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p className="text-lg font-medium mt-1">
                {session.user.name || "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">
                Email Address
              </label>
              <p className="text-lg font-medium mt-1">
                {session.user.email || "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">
                Account Role
              </label>
              <p className="text-lg font-medium mt-1 capitalize">
                {session.user.role?.toLowerCase() || "Customer"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Security */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Account Security</h2>
        <p className="text-sm text-muted-foreground mb-6">
          For security updates or password changes, please contact support.
        </p>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Note:</span> Profile editing functionality will be available soon.
            Contact support if you need to update your information.
          </p>
        </div>
      </Card>
    </div>
  );
}
