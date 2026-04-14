import type { Dish } from "./menu";

export interface Order {
  _id: string;
  orderCode: string;
  table?: string;
  branch?: string;
  customerName?: {
    displayName: string;
    tiers: "sprout" | "shoot" | "stem" | "grove" | "legend";
    points: number;
  };
  note?: string;
  deviceId?: string;
  dishes: {
    _id: string;
    dishName: {
      en: string;
      vi: string;
    };
    imageUrl?: string;
    quantity: number;
    price: number;
    note?: string;
  }[];
  discount: number;
  totalPrice: number;
  status: "pending" | "in-progress" | "served" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrderState {
  loading: boolean;
  edditing: boolean;
  cart: {
    dish: Dish;
    quantity: number;
    note?: string;
    price: number;
  }[];
  order: Order | null;
  orderOfBranch: Order[] | null;
  currentBranchId: string | null;
  loadingOrderSubmit: boolean;
  getAllOrdersOfBranch: () => Promise<void>;
  setCurrentBranchId: (branchId: string | null) => void;
  getOrderDetails: (orderId: string) => Promise<void>;
  addToCart: (dish: Dish, quantity: number, note?: string) => void;
  removeFromCart: (dishId: string) => void;
  sendOrder: (branchId: string, tableId: string) => Promise<void>;
}
