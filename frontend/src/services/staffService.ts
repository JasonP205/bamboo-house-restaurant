import api from "@/lib/axios";

export const staffService = {
    fetchStaffOfBranch: async (branchId: string) => {
        try {
            const res = await api.get(`/staffs?branchId=${branchId}`);
            return res.data.staffs;
        } catch (error) {
            console.error("Error fetching staff:", error);
            throw error;
        }
    },
    deleteStaff: async (staffIds: string[]) => {
        try {
            await api.delete(`/staffs`, { data: { staffIds } });
        } catch (error) {
            console.error("Error deleting staff:", error);
            throw error;
        }
    },  
    updateAvatar: async (file: File) => {
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const res = await api.patch("/staffs/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data.avatarUrl;
        } catch (error) {
            console.error("Error updating avatar:", error);
            throw error;
        }
    }
}