import api from "../lib/axios";

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
  staffRegister: async (
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    gender: "male" | "female" | "other",
    securityCode: string,
    branchId?: string,
  ) => {
    const response = await api.post("/auth/register/staff", {
      email,
      firstName,
      lastName,
      phoneNumber,
      gender,
      securityCode,
      branchId,
    });
    return response.data;
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
