import api from "@/lib/axios";

export const branchService = {
  getBranches: async () => {
    const response = await api.get("/branches");
    return response.data;
  },
};