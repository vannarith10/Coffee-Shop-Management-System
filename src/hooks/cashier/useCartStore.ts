// hooks/cashier/useCartStore.ts
// Zustand
import { create } from "zustand";
import { type ProductMenuItem } from "../../types/product";

export interface CartItem extends ProductMenuItem {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];

  addToCart: (product: ProductMenuItem) => void;
  removeFromCart: (productId: string) => void;
  increase: (productId: string) => void;
  decrease: (productId: string) => void;
  clearCart: () => void;
  setQuantity: (productId: string, quantity: number) => void;

  getTotalPrice: () => string;
  getTotalQuantity: () => number;
}

const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  // ======================================
  // SET
  // ======================================
  // Add to Cart
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        cart: [
          ...state.cart,
          {
            ...product,
            quantity: 1,
          },
        ],
      };
    }),

  // Remove from Cart
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),

  // Increase
  increase: (productId) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),

  // Decrease
  decrease: (productId) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    })),

  // Clear Cart
  clearCart: () => set({ cart: [] }),

  // Set quantity
  setQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    })),

  // ======================================
  // GET
  // ======================================
  // Get total price
  getTotalPrice: () =>
    get().cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),

  //   Get total qunatity
  getTotalQuantity: () =>
    get().cart.reduce((total, item) => total + item.quantity, 0),
}));



export default useCartStore;
