import api from "../lib/axios";
import type {DishFormData} from "@/components/dishes/CreateDishForm";
export const dishService = {
    createDish: async (id:string, data: DishFormData) => {
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
        const response = await api.post(`/branches/${id}/dishes`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.dish;
    }
};