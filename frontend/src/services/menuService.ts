import api from "../lib/axios";
import type {DishFormData} from "@/components/dishes/CreateDishForm";
export type EditDishData = {
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
    image?: File;
    dietary?: string[];
};

export type EditDishPatchData = Partial<EditDishData>;
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
    },
    deleteDish: async (dishId: string) => {
        const res = await api.delete(`/menu/${dishId}`);
        return res.data;
    },
        editDish: async (dishId:string, data: EditDishPatchData) => {
        const formData = new FormData();
                if (data.name) {
                    formData.append("name", JSON.stringify(data.name));
                }
                if (data.description) {
                    formData.append("description", JSON.stringify(data.description));
                }
                if (typeof data.price === "number") {
                    formData.append("price", data.price.toString());
                }
                if (data.category) {
                    formData.append("category", data.category);
                }
        if (data.image) {
            formData.append("image", data.image);
        }
                if (data.dietary) {
            formData.append("dietary", JSON.stringify(data.dietary));
        }
        const response = await api.put(`/menu/${dishId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.dish;
    },
};