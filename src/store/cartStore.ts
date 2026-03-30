import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string; // uuid de supabase
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (product: Product) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      addItem: (product) => set((state) => {
        const existing = state.items.find((i) => i.product.id === product.id);
        
        // Si ya existe en el carrito
        if (existing) {
          // Si tiene stock registrado (> 0) no puede excederlo
          if (product.stock > 0 && existing.quantity >= product.stock) {
            return state;
          }

          return {
            items: state.items.map((i) =>
              i.product.id === product.id 
                ? { ...i, quantity: i.quantity + 1 } 
                : i
            ),
            isDrawerOpen: true, // Auto abrir drawer
          };
        }
        
        // Producto nuevo en carrito
        return { 
          items: [...state.items, { product, quantity: 1 }],
          isDrawerOpen: true, 
        };
      }),

      updateQuantity: (id, qty) => set((state) => ({
        items: state.items.map((i) => {
          if (i.product.id === id) {
             const newQty = i.product.stock > 0 
                 ? Math.max(1, Math.min(qty, i.product.stock)) // Limitar si hay stock regular
                 : Math.max(1, qty); // Sin límite visual si es "A pedido" (stock 0)
             return { ...i, quantity: newQty };
          }
          return i;
        })
      })),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.product.id !== id)
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    { 
      name: 'soluciones-dys-cart',
      // No persistir el estado "visual" del Drawer cuando recargue
      partialize: (state) => ({ items: state.items }),
    }
  )
);
