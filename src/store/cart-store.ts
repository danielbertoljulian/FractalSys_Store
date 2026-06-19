import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  promotionalPrice?: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getItemCount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const key = `${item.productId}-${item.size}-${item.color}`
          const existing = state.items.findIndex(
            (i) => `${i.productId}-${i.size}-${i.color}` === key,
          )
          if (existing >= 0) {
            const updated = [...state.items]
            updated[existing] = {
              ...updated[existing],
              quantity: updated[existing].quantity + 1,
            }
            return { items: updated }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },

      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size && i.color === color),
          ),
        }))
      },

      updateQuantity: (productId, size, color, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.size === size && i.color === color
              ? { ...i, quantity: Math.max(1, quantity) }
              : i,
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.promotionalPrice ?? i.price) * i.quantity,
          0,
        ),
    }),
    { name: "fractalsys-cart" },
  ),
)
