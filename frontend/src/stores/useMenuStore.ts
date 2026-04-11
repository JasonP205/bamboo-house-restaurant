import { create } from "zustand";
import { dishService } from "@/services/menuService";
import type { MenuState } from "@/types/menu";
import type { DishFormData } from "@/components/dishes/CreateDishForm";

export const useMenuStore = create<MenuState>((set, get) => ({
  menu: [],
  loadingCreateDish: false,
  loadingFetchDishes: false,
  loadingToggleDishStatus: {},
  selectedDish: null,
  addDish: async (dish: DishFormData) => {
    try {
      set({ loadingCreateDish: true });
      const newDish = await dishService.createDish(dish);
      set((state) => ({
        menu: [newDish, ...state.menu],
      }));
    } catch (error) {
      console.error("Error creating dish:", error);
      throw error;
    } finally {
      set({ loadingCreateDish: false });
    }
  },
  getMenu: async () => {
    try {
      set({ loadingFetchDishes: true });
      const dishes = await dishService.fetchMenu();
      set({ menu: dishes });
    } catch (error) {
      console.error("Error fetching dishes in branch:", error);
    } finally {
      set({ loadingFetchDishes: false });
    }
  },
  changeDishStatus: async (dishId: string) => {
    try {
      set({
        loadingToggleDishStatus: {
          ...get().loadingToggleDishStatus,
          [dishId]: true,
        },
      });
      const res = await dishService.toggleDishStatus(dishId);
      set((state) => ({
        menu: state.menu.map((dish) =>
          dish._id === dishId ? { ...dish, isAvailable: res } : dish,
        ),
      }));
    } catch (error) {
      console.error("Error disabling dish:", error);
      throw error;
    } finally {
      set({
        loadingToggleDishStatus: {
          ...get().loadingToggleDishStatus,
          [dishId]: false,
        },
      });
    }
  },
  getDishById: async (dishId: string) => {
    try {
      set({ loadingFetchDishes: true });
      const dish = await dishService.fetchSelectedDish(dishId);
      set({ selectedDish: dish });
    } catch (error) {
      console.error("Error fetching dish details:", error);
    } finally {
      set({ loadingFetchDishes: false });
    }
  },
}));
