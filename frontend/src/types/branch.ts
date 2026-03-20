export interface Branch {
  _id: string;
  name: string;
  location: string;
  openingHours: {
    open: string;
    close: string;
  };
  contactNumber: string;
  imageUrl?: string;
  imageId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface branchState {
  branches: Branch[];
  loading: boolean;
  fetchBranches: () => Promise<void>;
  createBranch: (data: {
    name: string;
    location: string;
    contactNumber: string;
    openingHours: {
      open: string;
      close: string;
    };
    image?: File;
  }) => Promise<void>;
}
