import { create } from "zustand";
import { branchService } from "@/services/branchService";
import type { branchState } from "@/types/branch";
import { isAxiosError } from "axios";

export const useBranchStore = create<branchState>((set, get) => ({
  branches: [],
  loading: false,
  selectedBranchId: null,
  selectedBranch: null,
  tableBranch: [],
  loadingTables: false,
  loadingDelete: false,
  creatingTable: false,
  loadingEdit: false,
  loadingChangeBranchStatus: {},
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
        console.error(
          "Error fetching branch info:",
          error.response?.data?.message,
        );
      } else {
        console.error("Error fetching branch info:", error);
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  getTableOfBranch: async (id: string) => {
    try {
      set({ loadingTables: true });
      const tables = await branchService.getTableByBranchId(id);
      if (tables) {
        set({ tableBranch: tables });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(
          "Error fetching tables of branch:",
          error.response?.data?.message,
        );
      } else {
        console.error("Error fetching tables of branch:", error);
      }
      throw error;
    } finally {
      set({ loadingTables: false });
    }
  },
  deleteTable: async (id: string, tableIds: string[]) => {
    try {
      set({ loadingDelete: true });

      const { deletedCount, deletedIds } = await branchService.deleteTable(
        id,
        tableIds,
      );

      if (deletedIds?.length) {
        const deletedSet = new Set(deletedIds);

        set((state) => ({
          tableBranch: state.tableBranch.filter(
            (table) => !deletedSet.has(table._id),
          ),
          selectedBranch: state.selectedBranch
            ? {
                ...state.selectedBranch,
                totalTables: Math.max(
                  0,
                  state.selectedBranch.totalTables - deletedCount,
                ),
              }
            : null,
        }));
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error deleting tables:", error.response?.data?.message);
      } else {
        console.error("Error deleting tables:", error);
      }
      throw error;
    } finally {
      set({ loadingDelete: false });
    }
  },
  createTable: async (tables: { capacity: number }[]) => {
    try {
      set({ creatingTable: true });
      const branchId = get().selectedBranchId;
      if (!branchId) {
        throw new Error("No branch selected");
      }
      const newTables = await branchService.createTable(branchId, tables);
      set((state) => ({
        tableBranch: [...state.tableBranch, ...newTables],
        selectedBranch: state.selectedBranch
          ? {
              ...state.selectedBranch,
              totalTables: state.selectedBranch.totalTables + newTables?.length,
            }
          : null,
      }));
    } catch (error) {
      console.error("Error creating tables:", error);
      throw error;
    } finally {
      set({ creatingTable: false });
    }
  },
  editBranch: async (data) => {
    try {
      set({ loadingEdit: true });
      const branchId = get().selectedBranchId;
      if (!branchId) {
        throw new Error("No branch selected");
      }
      const updatedBranch = await branchService.editBranch(branchId, data);
      set((state) => ({
        branches: state.branches.map((b) =>
          b._id === branchId ? { ...b, ...updatedBranch } : b,
        ),
        selectedBranch: state.selectedBranch && state.selectedBranch._id === branchId ? { ...state.selectedBranch, ...updatedBranch } : state.selectedBranch,
      }));
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error editing branch:", error.response?.data?.message);
      } else {
        console.error("Error editing branch:", error);
      }
      throw error;
    } finally {
      set({ loadingEdit: false });
    }
  },
  changeOpenStatus: async (id: string) => {
    try {
      set({ loadingChangeBranchStatus: { ...get().loadingChangeBranchStatus, [id]: true } });
      const status = await branchService.changeOpenStatus(id);
      set((state) => ({
        branches: state.branches.map((b) =>
          b._id === id ? { ...b, isOpen: status } : b,
        ),
        selectedBranch: state.selectedBranch && state.selectedBranch._id === id ? { ...state.selectedBranch, isOpen: status } : state.selectedBranch,
      }));
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error toggling branch open status:", error.response?.data?.message);
      } else {
        console.error("Error toggling branch open status:", error);
      }
      throw error;
    } finally {
      set({ loadingChangeBranchStatus: { ...get().loadingChangeBranchStatus, [id]: false } });
    }
  },
}));
