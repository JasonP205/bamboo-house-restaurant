import { create } from "zustand";
import { type OrderState } from "@/types/order";
import { orderService } from "@/services/orderService";
import type { Dish } from "@/types/menu";
import { useAuthStore } from "./useAuthStore";
import { useBranchStore } from "./useBranchStore";
import { useSocketStore } from "./useSocketStore";

export const useOrderStore = create<OrderState>((set, get) => ({
  order: null,
  orderOfBranch: null,
  currentBranchId: null,
  loading: false,
  cart: [],
  edditing: false,
  loadingOrderSubmit: false,
  currentTableId: null,
  setCurrentTableId: (tableId: string | null) => {
    set({ currentTableId: tableId });
  },
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
      const order = await orderService.getOrderDetails(orderId);
      if (order) {
        const prevOrderOfBranch = get().orderOfBranch || [];
        set({ orderOfBranch: [order, ...prevOrderOfBranch], loading: false });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  },
  updateCartItem: (dish: Dish, quantity: number, note?: string) => {
    const existingItemIndex = get().cart.findIndex(
      (item) => item.dish._id === dish._id,
    );
    if (existingItemIndex !== -1) {
      const updatedCart = [...get().cart];
      updatedCart[existingItemIndex].quantity = quantity;
      updatedCart[existingItemIndex].note = note;
      set({ cart: updatedCart });
    } else {
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
  addToCart: (dish: Dish, quantity: number, note?: string) => {
    const socket = useSocketStore.getState().socket;
    const tableId = get().currentTableId;
    if (socket) {
      socket.emit("cart-updated", {
        tableId,
        dish,
        quantity,
        note,
      });
    }
  },
  removeFromCart: (dishId: string) => {
    const socket = useSocketStore.getState().socket;
    const tableId = get().currentTableId;
    if (socket) {
      socket.emit("remove-from-cart", { dishId, tableId });
    }
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
        console.log("Order submitted successfully:", order);
      }
      console.log("Order data to be sent:", orderData);
      set({ loadingOrderSubmit: false });
    } catch (error) {
      set({ loadingOrderSubmit: false });
      console.error("Error submitting order:", error);
      throw error;
    }
  },
  revokeOrder: async (orderId: string) => {
    try {
      await orderService.revokeOrder(orderId);
      set((state) => ({
        orderOfBranch: state.orderOfBranch
          ? state.orderOfBranch.filter((order) => order._id !== orderId)
          : null,
        order: state.order?._id === orderId ? null : state.order,
      }));
      useBranchStore.setState((state) => ({
        tableBranch: state.tableBranch.map((table) =>
          table.currentOrder?._id === orderId
            ? { ...table, currentOrder: undefined, isInUse: false }
            : table,
        ),
      }));
      console.log("Order revoked successfully:", orderId);
    } catch (error) {
      console.error("Error revoking order:", error);
    }
  },
  updateOrderStatus: async (orderId: string) => {
    try {
      const newOrder = await orderService.updateOrderStatus(orderId);
      if (newOrder) {
        set((state) => ({
          orderOfBranch: state.orderOfBranch
            ? state.orderOfBranch.map((order) =>
                order._id === orderId ? newOrder : order,
              )
            : null,
          order: state.order?._id === orderId ? newOrder : state.order,
        }));
      }
    } catch (error) {}
  },
}));
