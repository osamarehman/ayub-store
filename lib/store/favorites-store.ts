import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoriteItem {
  productId: string;
  addedAt: string;
}

interface FavoritesStore {
  // State
  items: FavoriteItem[];
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSynced: boolean;

  // Actions
  setAuthenticated: (authenticated: boolean) => void;
  addFavorite: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  syncWithServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      isAuthenticated: false,
      hasSynced: false,

      // Actions
      setAuthenticated: (authenticated) => {
        set({ isAuthenticated: authenticated });
        if (authenticated && !get().hasSynced) {
          // Sync local favorites to server when user logs in
          get().syncWithServer();
        }
      },

      addFavorite: async (productId) => {
        const { items, isAuthenticated } = get();

        // Check if already a favorite
        if (items.some((item) => item.productId === productId)) {
          return;
        }

        // Optimistically add to local state
        const newItem: FavoriteItem = {
          productId,
          addedAt: new Date().toISOString(),
        };
        set({ items: [...items, newItem] });

        // If authenticated, also add to server
        if (isAuthenticated) {
          try {
            const response = await fetch("/api/favorites", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
              // Rollback on error
              set({ items: items.filter((item) => item.productId !== productId) });
              console.error("Failed to add favorite to server");
            }
          } catch (error) {
            // Rollback on error
            set({ items: items.filter((item) => item.productId !== productId) });
            console.error("Error adding favorite:", error);
          }
        }
      },

      removeFavorite: async (productId) => {
        const { items, isAuthenticated } = get();
        const itemToRemove = items.find((item) => item.productId === productId);

        if (!itemToRemove) {
          return;
        }

        // Optimistically remove from local state
        set({ items: items.filter((item) => item.productId !== productId) });

        // If authenticated, also remove from server
        if (isAuthenticated) {
          try {
            const response = await fetch(
              `/api/favorites?productId=${encodeURIComponent(productId)}`,
              { method: "DELETE" }
            );

            if (!response.ok) {
              // Rollback on error
              set({ items: [...get().items, itemToRemove] });
              console.error("Failed to remove favorite from server");
            }
          } catch (error) {
            // Rollback on error
            set({ items: [...get().items, itemToRemove] });
            console.error("Error removing favorite:", error);
          }
        }
      },

      toggleFavorite: async (productId) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(productId)) {
          await removeFavorite(productId);
        } else {
          await addFavorite(productId);
        }
      },

      isFavorite: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      syncWithServer: async () => {
        const { items, isAuthenticated } = get();

        if (!isAuthenticated) {
          return;
        }

        set({ isLoading: true });

        try {
          // Get local product IDs
          const localProductIds = items.map((item) => item.productId);

          // Send to server to merge
          const response = await fetch("/api/favorites/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productIds: localProductIds }),
          });

          if (response.ok) {
            const data = await response.json();
            // Update local state with merged favorites from server
            set({
              items: data.productIds.map((productId: string) => ({
                productId,
                addedAt: new Date().toISOString(),
              })),
              hasSynced: true,
            });
          }
        } catch (error) {
          console.error("Error syncing favorites:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      loadFromServer: async () => {
        const { isAuthenticated } = get();

        if (!isAuthenticated) {
          return;
        }

        set({ isLoading: true });

        try {
          const response = await fetch("/api/favorites");
          if (response.ok) {
            const data = await response.json();
            set({
              items: data.favorites.map((fav: any) => ({
                productId: fav.productId,
                addedAt: fav.addedAt,
              })),
              hasSynced: true,
            });
          }
        } catch (error) {
          console.error("Error loading favorites from server:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearFavorites: () => {
        set({ items: [], hasSynced: false });
      },

      getFavoritesCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "binayub-favorites-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        hasSynced: state.hasSynced,
      }),
    }
  )
);
