import api from "@/lib/axios";
import { isAxiosError } from "axios";

export const orderService = {
  getOrderDetails: async (orderId: string) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },
  sendOrder: async (orderData: {
    branchId: string;
    tableId: string;
    dishes: {
      dish: string;
      quantity: number;
      note?: string;
    }[];
  }) => {
    try {
      const response = await api.post("/orders", orderData);
      return response.data.order;
    } catch (error) {
      console.error("Error sending order:", error);
      if (isAxiosError(error)) {
        const message =
          (error.response?.data as { message?: string } | undefined)?.message ||
          "Failed to send order";
        throw new Error(message);
      }
      throw error;
    }
  },
  fetchOrdersOfBranch: async (branchId: string) => {
    try {
      const response = await api.get(`/orders/branch/${branchId}`);
      return response.data.orders;
    } catch (error) {
      console.error("Error fetching orders of branch:", error);
      throw error;
    }
  },
  revokeOrder: async (orderId: string) => {
    try {
      await api.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error("Error revoking order:", error);
      throw error;
    }
  },
  updateOrderStatus: async (orderId: string) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`);
      return res.data.order;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },
  addDishToOrder: async (
    orderId: string,
    orderData: {
      branchId: string;
      tableId: string;
      dishes: {
        dish: string;
        quantity: number;
        note?: string;
      }[];
    },
  ) => {
    try {
      const response = await api.patch(`/orders/${orderId}`, orderData);
      return response.data.order;
    } catch (error) {
      console.error("Error adding dish to order:", error);
      throw error;
    }
  },
};
