import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartStore, CartItem } from "@/lib/types/cart";

const SHIPPING_THRESHOLD = 3000; // Free shipping above Rs. 3,000
const SHIPPING_COST = 200; // Rs. 200 flat rate

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,

      // Actions
      addItem: (itemData) => {
        const { items } = get();

        // Generate unique ID for cart item (product + variant combination)
        const itemId = `${itemData.productId}-${itemData.variantId}`;

        // Check if item already exists
        const existingItemIndex = items.findIndex(
          (item) => item.id === itemId
        );

        if (existingItemIndex > -1) {
          // Update quantity of existing item
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += itemData.quantity;

          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: itemId,
            ...itemData,
          };

          set({ items: [...items, newItem] });
        }
      },

      removeItem: (itemId) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        const { items } = get();

        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          set({ items: items.filter((item) => item.id !== itemId) });
          return;
        }

        const updatedItems = items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );

        set({ items: updatedItems });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.variantPrice * item.quantity,
          0
        );
      },

      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      getShippingCost: () => {
        const total = get().getCartTotal();
        return total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
      },

      getGrandTotal: () => {
        const cartTotal = get().getCartTotal();
        const shippingCost = get().getShippingCost();
        return cartTotal + shippingCost;
      },
    }),
    {
      name: "binayub-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
