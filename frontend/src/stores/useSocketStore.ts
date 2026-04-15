import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";
import type { SocketState } from "@/types/socket";
import { useOrderStore } from "./useOrderStore";
import { useBranchStore } from "./useBranchStore";

const baseURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5002";

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connectSocketStaff: () => {
    const exitsingSocket = get().socket;
    if (exitsingSocket) {
      console.warn("Socket staff connected");
      return;
    }
    const deviceId = useAuthStore.getState().deviceId;
    const branchId = useAuthStore.getState().branchId;

    const socket: Socket = io(baseURL, {
      query: { deviceId, branchId },
      transports: ["websocket"],
    });
    set({ socket });

    socket.on("connect", () => {
      console.log("Socket staff connected");
      socket.emit("joinBranchRoom", branchId);
    });

    socket.on("tableUpdated", (data) => {
      useBranchStore.getState().handleUpdateTableStatus(data);
    });

    const syncRealtimeOrderForStaff = (data: any) => {
      const realtimeOrder = data?.order;
      if (!realtimeOrder) return;

      useOrderStore.setState((state) => {
        const currentOrders = state.orderOfBranch || [];
        const exists = currentOrders.some((order) => order._id === realtimeOrder._id);

        return {
          orderOfBranch: exists
            ? currentOrders.map((order) =>
                order._id === realtimeOrder._id ? realtimeOrder : order,
              )
            : [realtimeOrder, ...currentOrders],
        };
      });
    };

    socket.on("order-created", syncRealtimeOrderForStaff);
    socket.on("order-items-added", syncRealtimeOrderForStaff);
    socket.on("order-status-updated", (data) => {
      syncRealtimeOrderForStaff(data);
      useBranchStore.getState().handleUpdateTableStatus({
        tableId: data?.tableId,
        orderId: data?.order?._id,
        status: data?.order?.status,
      });
    });
  },
  connectSocketCustomer: (tableId) => {
    const exitsingSocket = get().socket;
    if (exitsingSocket) {
      console.warn("Socket customer already connected");
      return;
    }
    const deviceId = useAuthStore.getState().deviceId;
    const branchId = useOrderStore.getState().currentBranchId;

    const socket: Socket = io(baseURL, {
      query: { deviceId, branchId },
      transports: ["websocket"],
    });
    set({ socket });

    socket.on("connect", () => {
      console.log("Socket customer connected");
      socket.emit("joinBranchRoom", branchId);
      socket.emit("join-TableRoom", tableId);
    });

    socket.on("current-cart", (data) => {
      const incomingCart = Array.isArray(data)
        ? data.map((item: any) => ({
            dish: item.dish,
            quantity: item.quantity,
            note: item.note,
            price: item.dish?.price || 0,
          }))
        : [];

      useOrderStore.setState({ cart: incomingCart });
    });

    socket.on("current-order", (data) => {
      if (!data) return;
      console.log("Loaded existing incomplete order from DB:", data);
      useOrderStore.setState({ order: data });
    });

    socket.on("remove-from-cart", (data) => {
      const dishId = data.dishId;
      useOrderStore.setState((state) => ({
        cart: state.cart.filter((item) => item.dish._id !== dishId),
      }));
    });

    const syncRealtimeOrderForTable = (data: any, shouldClearCart = false) => {
      if (!data?.order) return;
      const currentTableId = useOrderStore.getState().currentTableId;
      if (data.tableId !== currentTableId) return;

      useOrderStore.setState((state) => ({
        order: data.order,
        cart: shouldClearCart ? [] : state.cart,
      }));
    };

    socket.on("order-created", (data) => syncRealtimeOrderForTable(data, true));
    socket.on("order-items-added", (data) => syncRealtimeOrderForTable(data, true));
    socket.on("order-status-updated", (data) => syncRealtimeOrderForTable(data, false));
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log("Socket disconnected");
    }

  },
}));
