import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "@/types/auth";
import { authService } from "@/services/authService";
import { toast } from "@heroui/react";
import { isAxiosError } from "axios";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      loading: false,
      accessToken: null,
      user: null,
      branchId: null,
      clearSession: () => {
        set({ accessToken: null, user: null, branchId: null });
      },
      staffLogin: async () => {
        // Implementation for staff login
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
            toast.success("Signed in successfully!");
          }
        } catch (error) {
          if (isAxiosError(error)) {
            toast.danger("Oops...! Failed to sign in",{
              description: "Hmm, something's not right. Please double-check your info or reset your password if you've forgotten it.",
              timeout: 5000,
            });
          } else {
            toast.danger("Unexpected error");
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
            toast.success("Yay! You're officially a member", {
              description: "We can't wait to serve you soon!. Sign In now!!",
              timeout: 5000,
            })
          }
        } catch (error) {
          if (isAxiosError(error)) {
            toast.danger(error.response?.data?.message || "Register failed");
          } else {
            toast.danger("Unexpected error");
          }
          console.error("Error registering customer:", error);
        } finally {
          set({ loading: false });
        }
      },
      staffRegister: async () => {
        // Implementation for staff registration
      },
      logout: async () => {
        try {
          set({ loading: true });
          await authService.logout();
          get().clearSession();
        } catch (error) {
          if (isAxiosError(error)) {
            toast.danger(error.response?.data?.message || "Logout failed");
          } else {
            toast.danger("Unexpected error");
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
            toast.danger("Unexpected error");
          }
          console.error("Error refreshing session:", error);
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
        branchId: state.branchId,
      }),
    },
  ),
);
