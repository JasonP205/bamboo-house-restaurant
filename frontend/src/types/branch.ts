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

export interface BranchDetail extends Branch {
  indoorTables: number;
  outdoorTables: number;
  totalStaffs: number;
}

export interface branchState {
  branches: Branch[];
  loading: boolean;
  selectedBranchId: string | null;
  selectedBranch: BranchDetail | null;
  setSelectedBranchId: (id: string) => void;
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
  getBranchInfo: (id: string) => Promise<void>;
}
