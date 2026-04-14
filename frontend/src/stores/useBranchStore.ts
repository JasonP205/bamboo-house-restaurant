import { create } from "zustand";
import { branchService } from "@/services/branchService";
import { staffService } from "@/services/staffService";
import type { branchState } from "@/types/branch";
import { isAxiosError } from "axios";
import type { DishFormData } from "@/components/dishes/CreateDishForm";
import { useOrderStore } from "./useOrderStore";

export const useBranchStore = create<branchState>((set, get) => ({
  // Branch
  branches: [],
  loading: false,
  selectedBranchId: null,
  selectedBranch: null,
  loadingEditBranch: false,
  loadingChangeBranchStatus: {},
  setSelectedBranchId: (id: string) => {
    set({ selectedBranchId: id });
  },
  fetchBranches: async () => {
    try {
      set({ loading: true });
      const branches = await branchService.getBranches();
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
  editBranch: async (data) => {
    try {
      set({ loadingEditBranch: true });
      const branchId = get().selectedBranchId;
      if (!branchId) {
        throw new Error("No branch selected");
      }
      const updatedBranch = await branchService.editBranch(branchId, data);
      set((state) => ({
        branches: state.branches.map((b) =>
          b._id === branchId ? { ...b, ...updatedBranch } : b,
        ),
        selectedBranch:
          state.selectedBranch && state.selectedBranch._id === branchId
            ? { ...state.selectedBranch, ...updatedBranch }
            : state.selectedBranch,
      }));
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error editing branch:", error.response?.data?.message);
      } else {
        console.error("Error editing branch:", error);
      }
      throw error;
    } finally {
      set({ loadingEditBranch: false });
    }
  },
  changeOpenStatus: async (id: string) => {
    try {
      set({
        loadingChangeBranchStatus: {
          ...get().loadingChangeBranchStatus,
          [id]: true,
        },
      });
      const status = await branchService.changeOpenStatus(id);
      set((state) => ({
        branches: state.branches.map((b) =>
          b._id === id ? { ...b, isOpen: status } : b,
        ),
        selectedBranch:
          state.selectedBranch && state.selectedBranch._id === id
            ? { ...state.selectedBranch, isOpen: status }
            : state.selectedBranch,
      }));
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(
          "Error toggling branch open status:",
          error.response?.data?.message,
        );
      } else {
        console.error("Error toggling branch open status:", error);
      }
      throw error;
    } finally {
      set({
        loadingChangeBranchStatus: {
          ...get().loadingChangeBranchStatus,
          [id]: false,
        },
      });
    }
  },
  // Table
  tableBranch: [],
  loadingTables: false,
  loadingDeleteTable: false,
  creatingTable: false,
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
      set({ loadingDeleteTable: true });

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
      set({ loadingDeleteTable: false });
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

  //staff
  staffs: [],
  loadingFetchStaffs: false,
  loadingStaffAction: {},
  getStaffsOfBranch: async () => {
    try {
      set({ loadingFetchStaffs: true });
      const staffs = await staffService.fetchStaffOfBranch(
        get().selectedBranchId!,
      );
      if (staffs) {
        set({ staffs });
      }
    } catch (error) {
      console.error("Error fetching staffs of branch:", error);
      throw error;
    } finally {
      set({ loadingFetchStaffs: false });
    }
  },
  deleteStaff: async (staffIds: string[]) => {
    try {
      set({
        loadingStaffAction: {
          ...get().loadingStaffAction,
          delete: true,
        },
      });
      await staffService.deleteStaff(staffIds);
      const deletedSet = new Set(staffIds);
      set((state) => ({
        staffs: state.staffs.filter((staff) => !deletedSet.has(staff._id)),
      }));
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw error;
    } finally {
      set({
        loadingStaffAction: {
          ...get().loadingStaffAction,
          delete: false,
        },
      });
    }
  },

  handleUpdateTableStatus: (data) => {
    const { tableId, status, orderId } = data;
    set((state) => ({
      tableBranch: state.tableBranch.map((table) =>
        table._id === tableId
          ? {
              ...table,
              currentOrder: {
                _id: orderId,
                status: status,
              },
              isInUse: true,
            }
          : table,
      ),
    }));
    useOrderStore.getState().getOrderDetails(orderId);
  },
}));
