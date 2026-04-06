import api from "@/lib/axios";
import type { BranchCreateData } from "@/types/branch";

export const branchService = {
  getBranches: async () => {
    const response = await api.get("/branches");
    return response.data.branches;
  },
  createBranch: async (data: {
    name: string;
    location: string;
    contactNumber: string;
    openingHours: {
      open: string;
      close: string;
    };
    floorSpace: number;
    mapCoordinates: string;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append("mapCoordinates", data.mapCoordinates);
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("contactNumber", data.contactNumber);
    formData.append("floorSpace", data.floorSpace.toString());
    formData.append(
      "openingHours",
      JSON.stringify({
        open: data.openingHours.open,
        close: data.openingHours.close,
      }),
    );
    if (data.image) {
      formData.append("image", data.image);
    }
    const response = await api.post("/branches", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.branch;
  },
  editBranch: async (id: string, data: BranchCreateData) => {
    const formData = new FormData();

    const appendIfExists = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    };

    appendIfExists("mapCoordinates", data.mapCoordinates);
    appendIfExists("name", data.name);
    appendIfExists("location", data.location);
    appendIfExists("contactNumber", data.contactNumber);

    if (data.floorSpace !== undefined) {
      formData.append("floorSpace", data.floorSpace.toString());
    }

    if (data.openingHours) {
      formData.append(
        "openingHours",
        JSON.stringify({
          open: data.openingHours.open,
          close: data.openingHours.close,
        }),
      );
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.put(`/branches/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.branch;
  },
  getBranchById: async (id: string) => {
    const response = await api.get(`/branches/${id}`);
    return response.data.branch;
  },
  getTableByBranchId: async (id: string) => {
    const response = await api.get(`/branches/${id}/tables`);
    return response.data.tables;
  },
  deleteTable: async (id: string, tableIds: string[]) => {
    const response = await api.delete(`/branches/${id}/tables`, {
      data: { tables: tableIds },
    });
    return response.data;
  },
  createTable: async (id: string, tables: { capacity: number }[]) => {
    const response = await api.post(`/branches/${id}/tables`, { tables });
    return response.data.tables;
  },
  changeOpenStatus: async (id: string) => {
    const response = await api.patch(`/branches/${id}/open-status`);
    return response.data.result;
  },
};
