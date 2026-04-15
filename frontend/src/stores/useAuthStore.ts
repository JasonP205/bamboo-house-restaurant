import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "@/types/auth";
import { authService } from "@/services/authService";
import { toast } from "@heroui/react";
import { isAxiosError } from "axios";
import i18n from "@/i18n";
import type { AddStaffFormData } from "@/components/branch/AddStaffForm";
import { useBranchStore } from "./useBranchStore";
import { v4 as uuid } from "uuid";
import { staffService } from "@/services/staffService";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      deviceId: null,
      loading: false,
      accessToken: null,
      user: null,
      role: null,
      branchId: null,
      getDeviceId: () => {
        const deviceId = uuid().toString();
        set({ deviceId });
      },
      clearSession: () => {
        set({
          accessToken: null,
          user: null,
          branchId: null,
          loading: false,
          role: null,
        });
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
          }
        } catch (error) {
          console.error("Error logging in staff:", error);
          get().clearSession();
          throw error;
        } 
      },
      staffRegister: async (data: AddStaffFormData) => {
        try {
          set({ loading: true });
          const branchId = useBranchStore.getState().selectedBranchId!;
          const res = await authService.staffRegister(data, branchId);
          if (res) {
            const currentStaffList = useBranchStore.getState().staffs;
            useBranchStore.setState({
              staffs: [res, ...currentStaffList],
            });
            return res.staffId;
          }
        } catch (error) {
          throw error;
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
            toast.danger(i18n.t("auth:toast.unexpectedError"));
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
      uploadAvatar: async (avatar: File) => {
        try {
          set({ loading: true });
          const result = await staffService.updateAvatar(avatar);
          if (result) {
            set((state) => ({
              user: state.user ? { ...state.user, avatarUrl: result } : null,
            }));
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        deviceId: state.deviceId,
        accessToken: state.accessToken,
        user: state.user,
        role: state.role,
        branchId: state.branchId,
      }),
    },
  ),
);
