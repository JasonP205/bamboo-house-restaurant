import api from "../lib/axios";
import type {DishFormData} from "@/components/dishes/CreateDishForm";
export const dishService = {
    createDish: async (data: DishFormData) => {
        const formData = new FormData();
        formData.append("name", JSON.stringify(data.name));
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("category", data.category);
        if (data.image) {
            formData.append("image", data.image);
        }
        if (data.dietary) {
            formData.append("dietary", JSON.stringify(data.dietary));
        }
        const response = await api.post(`/menu`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.dish;
    },
    toggleDishStatus: async (dishId:string) => {
        const res = await api.patch(`/menu/${dishId}/status`);
        return res.data.result;
    },
    fetchMenu: async () => {
        const res = await api.get("/menu");
        return res.data.menu;
    },
    fetchSelectedDish: async (dishId:string) => {
        const res = await api.get(`/menu/${dishId}`);
        return res.data.dish;
    }
};