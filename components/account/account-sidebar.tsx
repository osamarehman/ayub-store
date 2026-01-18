"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    name: "Orders",
    href: "/account/orders",
    icon: ShoppingBag,
  },
  {
    name: "Settings",
    href: "/account/settings",
    icon: Settings,
  },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-background min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/account");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className="p-4 border-t">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
        >
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
