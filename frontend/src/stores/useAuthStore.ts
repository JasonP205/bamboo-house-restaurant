import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "@/types/auth";
import { authService } from "@/services/authService";
import { toast } from "@heroui/react";
import { isAxiosError } from "axios";
import i18n from "@/i18n";
import { useBranchStore } from "./useBranchStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      loading: false,
      accessToken: null,
      user: null,
      role: null,
      branchId: null,
      clearSession: () => {
        set({ accessToken: null, user: null, branchId: null, loading: false, role: null });
      },
      setAccessToken: (token: string) => {
        set({ accessToken: token });
      },
      staffLogin: async (data) => {
        try {
          get().clearSession();
          set({ loading: true });
          const accessToken = await authService.staffLogin(
            data.staffId,
            data.password,
          );
          if (accessToken) {
            set({
              accessToken: accessToken,
            });
            await get().fetchMe();
            await useBranchStore.getState().fetchBranches();
          }
        } catch (error) {
          console.error("Error logging in staff:", error);
          get().clearSession();
        } finally {
          set({ loading: false });
        }
      },
      customerLogin: async (data) => {
        try {
          get().clearSession();
          set({ loading: true });
          const accessToken = await authService.customerLogin(
            data.email,
            data.password,
          );
          console.log(accessToken);
          if (accessToken) {
            set({
              accessToken: accessToken,
            });
            toast.success(i18n.t("auth:toast.customer.login.success.title"), {
              description: i18n.t("auth:toast.customer.login.success.message"),
              timeout: 5000,
            });
            await get().fetchMe();
          }
        } catch (error) {
          if (isAxiosError(error)) {
            toast.danger(i18n.t("auth:toast.customer.login.error.title"), {
              description: i18n.t("auth:toast.customer.login.error.message"),
              timeout: 5000,
            });
          } else {
            toast.danger(i18n.t("auth:toast.customer.login.error.title"), {
              description: i18n.t("auth:toast.unexpectedError"),
              timeout: 5000,
            });
          }
          console.error("Error logging in customer:", error);
        } finally {
          set({ loading: false });
        }
      },
      customerRegister: async (data) => {
        try {
          set({ loading: true });
          const res = await authService.customerRegister(
            data.firstName,
            data.lastName,
            data.email,
            data.password,
          );
          console.log(res);
          if (res.success) {
            toast.success(
              i18n.t("auth:toast.customer.register.success.title"),
              {
                description: i18n.t(
                  "auth:toast.customer.register.success.message",
                ),
                timeout: 5000,
              },
            );
          }
        } catch (error) {
          if (isAxiosError(error)) {
            toast.danger(i18n.t("auth:toast.customer.register.error.title"), {
              description: i18n.t("auth:toast.customer.register.error.message"),
              timeout: 5000,
            });
          } else {
            toast.danger(i18n.t("auth:toast.unexpectedError"), {
              timeout: 5000,
            });
          }
          console.error("Error registering customer:", error);
        } finally {
          set({ loading: false });
        }
      },
      staffRegister: async (data) => {
        try {
          set({ loading: true });
          const res = await authService.staffRegister(
            data.email,
            data.firstName,
            data.lastName,
            data.phoneNumber,
            data.gender,
            data.securityCode,
            data?.branchId,
          );
          console.log(res);
          if (res.success) {
            toast.success(i18n.t("auth:managerPanel.toast.success.title"), {
              description: i18n.t("auth:managerPanel.toast.success.message"),
              timeout: 5000,
            });
          }
        } catch (error) {
          if (isAxiosError(error)) {
            toast.danger(i18n.t("auth:toast.staff.register.error.title"), {
              description: i18n.t("auth:toast.staff.register.error.message"),
              timeout: 5000,
            });
          } else {
            toast.danger(i18n.t("auth:toast.unexpectedError"), {
              timeout: 5000,
            });
          }
          console.error("Error registering staff:", error);
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        try {
          set({ loading: true });
          await authService.logout();
          get().clearSession();
        } catch (error) {
          if (isAxiosError(error)) {
            toast.danger(i18n.t("auth:toast.unexpectedError"), {
              timeout: 5000,
            });
          } else {
            toast.danger(i18n.t("auth.unexpectedError"));
          }
          console.error("Error logging out:", error);
        } finally {
          set({ loading: false });
        }
      },
      refresh: async () => {
        try {
          set({ loading: true });
          await authService.refresh();
        } catch (error) {
          if (isAxiosError(error)) {
            toast.danger(
              error.response?.data?.message || "Session refresh failed",
            );
          } else {
            toast.danger(i18n.t("auth:toast.unexpectedError"), {
              timeout: 5000,
            });
          }
          console.error("Error refreshing session:", error);
          get().clearSession();
        } finally {
          set({ loading: false });
        }
      },
      setBranchId: (branchId: string) => {
        set({ branchId });
      },
      fetchMe: async () => {
        try {
          set({ loading: true });
          const res = await authService.fetchMe();
          console.log("Fetched user data:", res);
          if (res.success) {
            set({
              user: res.user,
              role: res.user.role || null,
              branchId: res.user.branchId || null,
            });
          }
        } catch (error) {
          if (isAxiosError(error)) {
            toast.danger(
              error.response?.data?.message || "Failed to fetch user data",
              {
                timeout: 5000,
              },
            );
          } else {
            toast.danger(i18n.t("auth:toast.unexpectedError"), {
              timeout: 5000,
            });
          }
          console.error("Error fetching user data:", error);
          get().clearSession();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        role: state.role,
        branchId: state.branchId,
      }),
    },
  ),
);
