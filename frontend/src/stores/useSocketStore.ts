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

    socket.on("current-cart",(data)=>{
      console.log("Received current cart from server:", data);
      data.forEach((item: any) => {
        useOrderStore.getState().updateCartItem(item.dish, item.quantity, item.note);
      });
      // useOrderStore.getState().updateCartItem(data.dish, data.quantity, data.note);
    })
    socket.on("remove-from-cart", (data) => {
      const dishId = data.dishId;
      useOrderStore.setState((state) => ({
        cart: state.cart.filter((item) => item.dish._id !== dishId),
       }));
    })
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
