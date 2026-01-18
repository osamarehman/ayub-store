"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useFavoritesStore } from "@/lib/store/favorites-store";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { setAuthenticated, syncWithServer, loadFromServer, hasSynced } =
    useFavoritesStore();

  useEffect(() => {
    if (status === "loading") return;

    const isAuthenticated = !!session?.user;
    setAuthenticated(isAuthenticated);

    if (isAuthenticated && !hasSynced) {
      // Sync local favorites with server when user logs in
      syncWithServer();
    } else if (isAuthenticated && hasSynced) {
      // Just load from server if already synced before
      loadFromServer();
    }
  }, [session, status, setAuthenticated, syncWithServer, loadFromServer, hasSynced]);

  return <>{children}</>;
}
