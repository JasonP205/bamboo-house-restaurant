import api from "@/lib/axios";

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
  }
};
