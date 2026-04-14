import api from "../lib/axios";
import type { AddStaffFormData } from "@/components/branch/AddStaffForm";

export const authService = {
  customerLogin: async (email: string, password: string) => {
    const response = await api.post("/auth/login/customer", {
      email,
      password,
    });
    return response.data.accessToken;
  },
  staffLogin: async (staffId: string, password: string) => {
    const response = await api.post("/auth/login/staff", {
      staffId,
      password,
    });
    return response.data.accessToken;
  },
  customerRegister: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    const response = await api.post("/auth/register/customer", {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },
  staffRegister: async (data: AddStaffFormData, branchId: string) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("gender", data.gender);
    formData.append("avatar", data.avatar);
    formData.append("branchId", branchId);
    const response = await api.post("/auth/register/staff", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.staff;
  },
  refresh: async () => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
  logout: async () => {
    await api.post("/auth/logout");
  },
  fetchMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
