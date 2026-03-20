import { create } from "zustand";
import { persist } from "zustand/middleware";
import { branchService } from "@/services/branchService";
import type { branchState } from "@/types/branch";
import { isAxiosError } from "axios";
import i18n from "@/i18n";
import { toast } from "@heroui/react";

const t = (key: string) => i18n.t(key);
export const useBranchStore = create<branchState>()(
  persist(
    (set) => ({
      branches: [],
      loading: false,
      fetchBranches: async () => {
        try {
          set({ loading: true });
          const branches = await branchService.getBranches();
          console.log("Fetched branches:", branches);
          set({ branches });
        } catch (error) {
          if (isAxiosError(error)) {
            console.error(
              "Error fetching branches:",
              error.response?.data?.message,
            );
          } else {
            console.error("Error fetching branches:", error);
          }
        } finally {
          set({ loading: false });
        }
      },
      createBranch: async (data) => {
        try {
          set({ loading: true });
          const newBranch = await branchService.createBranch(data);
          if (newBranch) {
            set((state) => ({
              branches: [...state.branches, newBranch],
            }));
          }
        } catch (error) {
          if (isAxiosError(error)) {
            console.error(
              "Error creating branch:",
              error.response?.data?.message,
            );
          } else {
            console.error("Error creating branch:", error);
          }
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "branch-storage",
      partialize: (state) => ({ branches: state.branches }),
    },
  ),
);
