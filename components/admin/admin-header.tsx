"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";
import { LogOut, User, Bell } from "lucide-react";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Left - Hidden on desktop (sidebar has brand) */}
        <div className="lg:hidden">
          <h1 className="text-lg font-bold">Bin Ayub</h1>
        </div>

        {/* Center spacer for desktop */}
        <div className="hidden lg:block" />

        {/* Right - User info and actions */}
        <div className="flex items-center gap-3">
          {/* Notification placeholder */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
