export interface CartItem {
  id: string; // Unique cart item ID (combination of product + variant)
  productId: string;
  productName: string;
  productSlug: string;
  productBrand: string;
  productImage: string;
  variantId: string;
  variantSize: string;
  variantPrice: number;
  variantSku: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

export interface CartActions {
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getShippingCost: () => number;
  getGrandTotal: () => number;
}

export type CartStore = CartState & CartActions;
