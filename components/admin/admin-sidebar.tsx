"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ImageIcon,
  Store,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Assets",
    href: "/admin/assets",
    icon: ImageIcon,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-72 border-r bg-card min-h-[calc(100vh-4rem)] shadow-sm">
      {/* Brand Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Bin Ayub</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
          Menu
        </p>
        {navigation.map((item) => {
          const Icon = item.icon;
          // Dashboard should only be active on exact /admin path
          // Other items should be active on exact match or sub-paths
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={false}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Back to Store */}
      <div className="p-4 border-t bg-muted/30">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg bg-background border border-border hover:bg-muted hover:border-primary/50 transition-all"
        >
          <Store className="h-4 w-4" />
          View Store
        </Link>
      </div>
    </aside>
  );
}
