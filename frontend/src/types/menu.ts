import type { DishFormData } from "@/components/dishes/CreateDishForm";
import type { EditDishPatchData } from "@/services/menuService";

export interface Dish {
  _id: string;

  name: {
    en: string;
    vi: string;
  };

  description: {
    en: string;
    vi: string;
  };

  category: string;

  price: number;

  dietary: string[];

  isAvailable: boolean;

  imageUrl: string;

  createdAt: string;
  updatedAt: string;

  __v: number;
}
export interface MenuState {
  // Dish
  menu: Dish[];
  selectedDish: Dish | null;  
  loadingCreateDish: boolean;
  loadingFetchDishes: boolean;
  loadingToggleDishStatus: {
    [key: string]: boolean;
  };
  addDish: (dish: DishFormData) => Promise<void>;
  getMenu: () => Promise<void>;
  changeDishStatus: (dishId: string) => Promise<void>;
  getDishById: (dishId: string) => Promise<void>;
  deleteDish: (dishId: string) => Promise<void>;
  updateDish: (dishId: string, data: EditDishPatchData) => Promise<void>;
}
