import api from "@/lib/axios";

export type UpdateStaffPayload = {
    displayName: string;
    email: string;
    gender: "male" | "female" | "other";
    dateOfJoining: string;
};

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
            const res = await api.delete(`/staffs`, { data: { staffIds } });
            return res.data?.deletedCount ?? 0;
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
    },
    fetchStaffById: async (staffId: string) => {
        try {
            const res = await api.get(`/staffs/${staffId}`);
            return res.data.staff;
        } catch (error) {
            console.error("Error fetching staff detail:", error);
            throw error;
        }
    },
    updateStaffById: async (staffId: string, payload: UpdateStaffPayload) => {
        try {
            const res = await api.patch(`/staffs/${staffId}`, payload);
            return res.data.staff;
        } catch (error) {
            console.error("Error updating staff detail:", error);
            throw error;
        }
    }
}