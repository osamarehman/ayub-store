"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";
import { LogOut, User } from "lucide-react";

interface AccountHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AccountHeader({ user }: AccountHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold">My Account</h1>
          <p className="text-xs text-muted-foreground">Manage your profile and orders</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{user.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
