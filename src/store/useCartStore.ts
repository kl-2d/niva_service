import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Service } from "@prisma/client";

interface CartState {
  items: Service[];
  addItem: (service: Service) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalPrice: 0,

      addItem: (service) =>
        set((state) => {
          if (state.items.find((i) => i.id === service.id)) return state;
          const newItems = [...state.items, service];
          return {
            items: newItems,
            totalPrice: newItems.reduce((acc, curr) => acc + curr.price, 0),
          };
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          return {
            items: newItems,
            totalPrice: newItems.reduce((acc, curr) => acc + curr.price, 0),
          };
        }),

      clearCart: () => set({ items: [], totalPrice: 0 }),
    }),
    {
      name: "niva-cart", // localStorage key
      // Only persist items — totalPrice is derived, would be recalc on rehydrate
      partialize: (state) => ({ items: state.items, totalPrice: state.totalPrice }),
    }
  )
);
