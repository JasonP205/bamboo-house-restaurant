import api from "@/lib/axios";

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
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("contactNumber", data.contactNumber);
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
};
