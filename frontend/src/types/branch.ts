import type { DishFormData } from "@/components/dishes/CreateDishForm";
export interface Branch {
  _id: string;
  name: string;
  location: string;
  mapCoordinates: string;
  openingHours: {
    open: string;
    close: string;
  };
  contactNumber: string;
  imageUrl?: string;
  imageId?: string;
  isOpen?: boolean;
  floorSpace?: string;
  totalTables: number;
  createdAt: string;
  updatedAt: string;
}
export interface Table {
  _id: string;
  number: number;
  capacity: number;
  isInUse: boolean;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface BranchDetail extends Branch {
  tables: number;
  totalStaffs: number;
}
export interface BranchCreateData {
  name: string;
  location: string;
  mapCoordinates: string;
  contactNumber: string;
  openingHours: {
    open: string;
    close: string;
  };
  floorSpace: number;
  image?: File;
}
export interface Dish {
  _id: string;
  name: {
    en: string;
    vi: string;
  };
  description?: string;
  category: "appetizers" | "main" | "desserts" | "beverages";
  price: number;
  isAvailable?: boolean;
  imageUrl?:string;
  createdAt?: string;
  updatedAt?: string;
}

export interface branchState {
  loading: boolean,
  loadingTables: boolean;
  loadingDeleteTable: boolean;
  creatingTable: boolean;
  loadingEditBranch: boolean;
  loadingChangeBranchStatus: {
    [key: string]: boolean; 
  };
  branches: Branch[];
  selectedBranchId: string | null;
  selectedBranch: BranchDetail | null;
  tableBranch: Table[];
  createTable: (tables: { capacity: number }[]) => Promise<void>;
  deleteTable: (id: string, tableIds: string[]) => Promise<void>;
  changeOpenStatus: (id: string) => Promise<void>;
  getTableOfBranch: (id: string) => Promise<void>;
  setSelectedBranchId: (id: string) => void;
  fetchBranches: () => Promise<void>;
  createBranch: (data: BranchCreateData) => Promise<void>;
  getBranchInfo: (id: string) => Promise<void>;
  editBranch: (data: BranchCreateData) => Promise<void>;

  // Dish
  dishesInBranch: Dish[];
  loadingCreateDish: boolean;
  loadingFetchDishes: boolean;
  addDish: (dish: DishFormData) => Promise<void>;
  fetchDishesInBranch: () => Promise<void>;
}
