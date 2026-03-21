import { create } from "zustand";
import { branchService } from "@/services/branchService";
import type { branchState } from "@/types/branch";
import { isAxiosError } from "axios";

export const useBranchStore = create<branchState>((set, get) => ({
  branches: [],
  loading: false,
  selectedBranchId: null,
  selectedBranch: null,
  setSelectedBranchId: (id: string) => {
    set({ selectedBranchId: id });
  },
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
        console.error("Error creating branch:", error.response?.data?.message);
      } else {
        console.error("Error creating branch:", error);
      }
    } finally {
      set({ loading: false });
    }
  },
  getBranchInfo: async (id: string) => {
    try {
      set({ loading: true });
      const branch = await branchService.getBranchById(id);
      set({ selectedBranch: branch });
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error fetching branch info:", error.response?.data?.message);
      } else {
        console.error("Error fetching branch info:", error);
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
