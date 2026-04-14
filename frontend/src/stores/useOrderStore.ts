import { create } from "zustand";
import { type OrderState } from "@/types/order";
import { orderService } from "@/services/orderService";
import type { Dish } from "@/types/menu";
import { useAuthStore } from "./useAuthStore";

export const useOrderStore = create<OrderState>((set, get) => ({
  order: null,
  orderOfBranch: null,
  currentBranchId: null,
  loading: false,
  cart: [],
  edditing: false,
  loadingOrderSubmit: false,
  setCurrentBranchId: (branchId: string | null) => {
    set({ currentBranchId: branchId });
  },
  getAllOrdersOfBranch: async () => {
    try {
      const branchId = useAuthStore.getState().branchId;
      if (!branchId) {
        console.warn("No branch ID set for fetching orders");
        return;
      }
      set({ loading: true });
      const response = await orderService.fetchOrdersOfBranch(branchId);  
      set({ orderOfBranch: response, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching orders:", error);
    }
  },
  getOrderDetails: async (orderId: string) => {
    try {
      set({ loading: true });
      const order = await orderService.getOrderDetails(orderId);
      if (order) {
        const prevOrderOfBranch = get().orderOfBranch || [];
        set({ orderOfBranch: [order, ...prevOrderOfBranch], loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.error("Error fetching order details:", error);
    }
  },
  addToCart: (dish: Dish, quantity: number, note?: string) => {
    const existingItemIndex = get().cart.findIndex(
      (item) => item.dish._id === dish._id,
    );
    if (existingItemIndex !== -1) {
      // Nếu món đã tồn tại trong giỏ, tăng số lượng
      const updatedCart = [...get().cart];
      updatedCart[existingItemIndex].quantity = quantity;
      updatedCart[existingItemIndex].note = note;
      updatedCart[existingItemIndex].price = dish.price;
      set({ cart: updatedCart });
    } else {
      // Nếu món chưa tồn tại, thêm mới vào giỏ
      set((state) => ({
        cart: [
          ...state.cart,
          {
            dish: dish,
            quantity: quantity,
            note: note,
            price: dish.price,
          },
        ],
      }));
    }
  },
  removeFromCart: (dishId: string) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.dish._id !== dishId),
    }));
  },
  sendOrder: async (branchId: string, tableId: string) => {
    try {
      set({ loadingOrderSubmit: true });
      const { cart } = get();
      const orderData = {
        branchId,
        tableId,
        dishes: cart.map((item) => ({
          dish: item.dish._id,
          quantity: item.quantity,
          note: item.note,
        })),
      };
      const order = await orderService.sendOrder(orderData);
      if (order) {
        set({ order, cart: [] });
      }
      console.log("Order data to be sent:", orderData);
      set({ loadingOrderSubmit: false });
    } catch (error) {
      set({ loadingOrderSubmit: false });
      console.error("Error submitting order:", error);
    }
  },
}));
